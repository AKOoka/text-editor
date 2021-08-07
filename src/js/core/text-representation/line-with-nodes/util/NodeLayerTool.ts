import { TextStyle } from '../../../../common/TextStyle'
import { INodeContainer, INodeText } from '../nodes/INode'
import { NodeCreator } from './NodeCreator'
import { MergeResult, NodeMerger } from './NodeMerger'
import { RangeWithOffset } from './RangeWithOffset'
import { NodeLayer } from '../NodeLayer'
import { ILinkedNodeReadonly } from '../ILinkedNode'

export class NodeLayerTool {
  private readonly _nodeCreator: NodeCreator
  private readonly _nodeMerger: NodeMerger

  constructor (nodeMerger: NodeMerger, nodeCreator: NodeCreator) {
    this._nodeCreator = nodeCreator
    this._nodeMerger = nodeMerger
  }

  replaceNodeTextPartLeftWithNodeTextStyle (
    nodeLayer: NodeLayer,
    linkedNode: ILinkedNodeReadonly,
    splitPosition: number,
    textStyle: TextStyle
  ): void {
    const { prev, node } = linkedNode as ILinkedNodeReadonly<INodeText>
    const newNodeTextStyleText: string = node.text.slice(0, splitPosition)

    node.text = node.text.slice(splitPosition)

    if (prev !== null) {
      const mergeResult: MergeResult = this._nodeMerger.mergeIfPossibleNodeWithTextStyle(
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
    nodeLayer: NodeLayer,
    linkedNode: ILinkedNodeReadonly,
    splitPosition: number,
    textStyle: TextStyle
  ): void {
    const { next, node } = linkedNode as ILinkedNodeReadonly<INodeText>
    const newNodeTextStyleText: string = node.text.slice(splitPosition)

    node.text = node.text.slice(0, splitPosition)

    if (next !== null) {
      const mergeResult: MergeResult = this._nodeMerger.mergeIfPossibleNodeWithTextStyle(
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

  replaceNodeTextPartMiddleWithNodeTextStyle (nodeLayer: NodeLayer, linkedNode: ILinkedNodeReadonly, range: RangeWithOffset, textStyle: TextStyle): void {
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

  replaceNodeTextWithNodeTextStyle (nodeLayer: NodeLayer, linkedNode: ILinkedNodeReadonly, textStyle: TextStyle): void {
    const { prev, node, next } = linkedNode as ILinkedNodeReadonly<INodeText>

    if (prev !== null) {
      const leftMergeResult: MergeResult = this._nodeMerger.mergeIfPossibleNodeWithTextStyle(
        prev.node,
        node.text,
        textStyle,
        true
      )

      if (leftMergeResult.success) {
        if (next !== null) {
          const mergedNodes = this._nodeMerger.mergeIfPossibleTwoNodes(leftMergeResult.node, next.node)

          nodeLayer.delete(prev)

          if (mergedNodes.success) {
            nodeLayer.delete(next)
            linkedNode.node = mergedNodes.node
            return
          }
        }

        linkedNode.node = leftMergeResult.node
        return
      } else if (next !== null) {
        const rightMergeResult: MergeResult = this._nodeMerger.mergeIfPossibleNodeWithTextStyle(
          next.node,
          node.text,
          textStyle,
          false
        )

        if (rightMergeResult.success) {
          nodeLayer.delete(next)
          linkedNode.node = rightMergeResult.node
          return
        }
      }
    }

    linkedNode.node = this._nodeCreator.createNodeTextStyle(node.text, textStyle)
  }

  replaceNodeTextStyleWithNodeContainer (nodeLayer: NodeLayer, linkedNode: ILinkedNodeReadonly, textStyle: TextStyle): void {
    const { prev, next, node } = linkedNode as ILinkedNodeReadonly<INodeContainer>

    if (prev !== null) {
      const leftMergeResult: MergeResult = this._nodeMerger.mergeIfPossibleNodeContainerWithNode(prev.node, node.style, node.childNodes, false)

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
