import { TextStyle } from '../../../../common/TextStyle'
import { INodeContainer, INodeText, NodeType, Node } from '../nodes/Node'
import { NodeCreator } from './NodeCreator'
import { MergeResult, NodeMerger } from './merger/NodeMerger'
import { RangeWithOffset } from './RangeWithOffset'
import { NodeChildren } from '../nodes/NodeChildren'
import { ILinkedNodeReadonly } from '../ILinkedNode'
import { NodeContainerMergerStrategy } from './merger/NodeContainerMergerStrategy'
import { NodeTextMergerStrategy } from './merger/NodeTextMergerStrategy'
import { NodeTextStyleMergerStrategy } from './merger/NodeTextStyleMergerStrategy'
import { BaseNodeMergerStrategy } from './merger/BaseNodeMergerStrategy'

export class NodeChildrenTool {
  private readonly _nodeCreator: NodeCreator
  private readonly _nodeMerger: NodeMerger
  private readonly _mergerStrategy: Record<NodeType, BaseNodeMergerStrategy>

  constructor (nodeMerger: NodeMerger, nodeCreator: NodeCreator) {
    this._nodeCreator = nodeCreator
    this._nodeMerger = nodeMerger
    this._mergerStrategy = {
      [NodeType.TEXT]: new NodeTextMergerStrategy(this._nodeMerger),
      [NodeType.TEXT_STYLE]: new NodeTextStyleMergerStrategy(this._nodeMerger),
      [NodeType.CONTAINER]: new NodeContainerMergerStrategy(this._nodeMerger)
    }
  }

  mergeIfPossibleTwoNodes (leftNode: Node, rightNode: Node): MergeResult {
    return this._mergerStrategy[leftNode.type].mergeIfPossibleTwoNodes(leftNode, rightNode)
  }

  replaceNodeTextPartLeftWithNodeTextStyle (
    nodeLayer: NodeChildren,
    linkedNode: ILinkedNodeReadonly,
    splitPosition: number,
    textStyle: TextStyle
  ): void {
    const { prev, node } = linkedNode as ILinkedNodeReadonly<INodeText>
    const newNodeTextStyleText: string = node.text.slice(0, splitPosition)

    node.text = node.text.slice(splitPosition)

    if (prev !== null) {
      const mergeResult: MergeResult = this._nodeMerger.mergeIfPossibleNodeWithNodeTextStyleContent(
        prev.node,
        newNodeTextStyleText,
        textStyle,
        true
      )

      if (mergeResult.success) {
        prev.node = mergeResult.node
        nodeLayer.delete(linkedNode)
        return
      }
    }

    nodeLayer.addBefore(linkedNode, this._nodeCreator.createNodeTextStyle(newNodeTextStyleText, textStyle))
  }

  replaceNodeTextPartRightWithNodeTextStyle (
    nodeLayer: NodeChildren,
    linkedNode: ILinkedNodeReadonly,
    splitPosition: number,
    textStyle: TextStyle
  ): void {
    const { next, node } = linkedNode as ILinkedNodeReadonly<INodeText>
    const newNodeTextStyleText: string = node.text.slice(splitPosition)

    node.text = node.text.slice(0, splitPosition)

    if (next !== null) {
      const mergeResult: MergeResult = this._nodeMerger.mergeIfPossibleNodeWithNodeTextStyleContent(
        next.node,
        newNodeTextStyleText,
        textStyle,
        false
      )

      if (mergeResult.success) {
        next.node = mergeResult.node
        nodeLayer.delete(linkedNode)
        return
      }
    }

    nodeLayer.addAfter(linkedNode, this._nodeCreator.createNodeTextStyle(newNodeTextStyleText, textStyle))
  }

  replaceNodeTextPartMiddleWithNodeTextStyle (nodeLayer: NodeChildren, linkedNode: ILinkedNodeReadonly, range: RangeWithOffset, textStyle: TextStyle): void {
    const { node } = linkedNode as ILinkedNodeReadonly<INodeText>

    nodeLayer.addAfter(
      linkedNode,
      this._nodeCreator.createNodeTextStyle(
        node.text.slice(range.startWithOffset, range.endWithOffset),
        textStyle
      )
    )

    if (linkedNode.next !== null) {
      nodeLayer.addAfter(
        linkedNode.next,
        this._nodeCreator.createNodeText(node.text.slice(range.endWithOffset))
      )
    } else {
      throw new Error('linkedNode.next === null, must be new NodeTextStyle()')
    }

    node.text = node.text.slice(0, range.startWithOffset)
  }

  replaceNodeTextWithNodeTextStyle (nodeChildren: NodeChildren, linkedNode: ILinkedNodeReadonly, textStyle: TextStyle): void {
    const { prev, node, next } = linkedNode as ILinkedNodeReadonly<INodeText>

    if (prev !== null) {
      const leftMergeResult: MergeResult = this._nodeMerger.mergeIfPossibleNodeWithNodeTextStyleContent(
        prev.node,
        node.text,
        textStyle,
        true
      )

      if (leftMergeResult.success) {
        if (next !== null) {
          const mergedNodes = this._nodeMerger.mergeIfPossibleTwoNodes(leftMergeResult.node, next.node)

          nodeChildren.delete(prev)

          if (mergedNodes.success) {
            nodeChildren.delete(next)
            linkedNode.node = mergedNodes.node
            return
          }
        }

        linkedNode.node = leftMergeResult.node
        return
      }
    }

    if (next !== null) {
      const rightMergeResult: MergeResult = this._nodeMerger.mergeIfPossibleNodeWithNodeTextStyleContent(
        next.node,
        node.text,
        textStyle,
        false
      )

      if (rightMergeResult.success) {
        nodeChildren.delete(next)
        linkedNode.node = rightMergeResult.node
        return
      }
    }

    linkedNode.node = this._nodeCreator.createNodeTextStyle(node.text, textStyle)
  }

  replaceNodeTextStyleWithNodeContainer (nodeLayer: NodeChildren, linkedNode: ILinkedNodeReadonly, textStyle: TextStyle): void {
    const { prev, next, node } = linkedNode as ILinkedNodeReadonly<INodeContainer>

    if (prev !== null) {
      const leftMergeResult: MergeResult = this._nodeMerger.mergeIfPossibleNodeWithNodeContainerContent(prev.node, node.style, node.childNodes, false)

      if (next !== null) {
        if (leftMergeResult.success) {
          const mergeResult: MergeResult = this._nodeMerger.mergeIfPossibleTwoNodes(leftMergeResult.node, next.node)

          return
        }

        return
      }
    } else if (next !== null) {

    }

    linkedNode.node = this._nodeCreator.createNodeContainer(
      textStyle,
      this._nodeCreator.createNodeLayer(node)
    )
  }
}
