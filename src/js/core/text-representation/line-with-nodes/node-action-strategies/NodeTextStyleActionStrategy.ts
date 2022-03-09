import { TextStyle } from '../../../../common/TextStyle'
import { BaseNodeTextActionStrategy } from './BaseNodeTextActionStrategy'
import { Node, INodeTextStyle, NodeType, INodeText } from '../nodes/Node'
import { MergeResult } from '../util/merger/NodeMerger'
import { RangeWithOffset } from '../util/RangeWithOffset'
import { NodeChildren } from '../nodes/NodeChildren'
import { ILinkedNodeReadonly } from '../ILinkedNode'

export class NodeTextStyleActionStrategy extends BaseNodeTextActionStrategy {
  addTextStyle (nodeChildren: NodeChildren, linkedNode: ILinkedNodeReadonly, range: RangeWithOffset, textStyle: TextStyle): void {
    const { node } = linkedNode as ILinkedNodeReadonly<INodeTextStyle>

    if (node.style.deepCompare(textStyle)) {
      return
    }

    if (range.isNodeInsideRange(node.size)) {
      linkedNode.node = this._nodeCreator.createNodeContainer(textStyle, new NodeChildren(node))
    } else if (range.isRangeInsideNode(node.size)) {
      nodeChildren.addBefore(linkedNode, this._nodeCreator.createNodeTextStyle(node.text.slice(0, range.startWithOffset), node.style))
      nodeChildren.addBefore(
        linkedNode,
        this._nodeCreator.createNodeContainer(
          textStyle,
          new NodeChildren(this._nodeCreator.createNodeTextStyle(
            node.text.slice(range.startWithOffset, range.endWithOffset),
            node.style
          ))
        )
      )

      node.text = node.text.slice(range.endWithOffset)
    } else if (range.isNodeStartInRange(node.size)) {
      const nodeNewText: string = node.text.slice(range.endWithOffset)
      const newNodeTextStyleText: string = node.text.slice(0, range.endWithOffset)

      node.text = nodeNewText

      if (leftNode !== undefined) {
        const mergeResult: MergeResult = this._nodeMerger.mergeIfPossibleNodeWithNodeTextStyleContent(
          leftNode,
          newNodeTextStyleText,
          textStyle,
          true
        )

        if (mergeResult.success) {
          nodeChildren.splice(nodeIndex - 1, 1, mergeResult.node)
          return
        }
      }

      nodeChildren.splice(
        nodeIndex,
        0,
        this._nodeCreator.createNodeTextStyle(newNodeTextStyleText, textStyle)
      )
    } else if (range.isNodeEndInRange(node.size)) {
      const nodeNewText: string = node.text.slice(0, range.startWithOffset)
      const newNodeTextStyleText: string = node.text.slice(range.startWithOffset)

      node.text = nodeNewText

      if (rightNode !== undefined) {
        const mergeResult: MergeResult = this._nodeMerger.mergeIfPossibleNodeWithNodeTextStyleContent(
          rightNode,
          newNodeTextStyleText,
          textStyle,
          false
        )

        if (mergeResult.success) {
          nodeChildren.splice(nodeIndex + 1, 1, mergeResult.node)
          return
        }
      }

      nodeChildren.splice(
        nodeIndex + 1,
        0,
        this._nodeCreator.createNodeTextStyle(newNodeTextStyleText, textStyle)
      )
    }
  }

  deleteTextStyleAll (nodeLayer: NodeChildren, linkedNode: ILinkedNodeReadonly, range: RangeWithOffset,): void {
    const node: INodeTextStyle = nodeLayer[nodeIndex] as INodeTextStyle
    const leftNode: Node | undefined = nodeLayer[nodeIndex - 1]
    const rightNode: Node | undefined = nodeLayer[nodeIndex + 1]

    if (range.isNodeInsideRange(node.size)) {
      if (leftNode !== undefined && leftNode.type === NodeType.TEXT) {
        const newLeftNode: INodeText = this._nodeMerger.mergeNodeTextWithNodeTextContent(leftNode, node.text, true)

        if (rightNode !== undefined && rightNode.type === NodeType.TEXT) {
          const mergedNodes: INodeText = this._nodeMerger.mergeTwoNodeText(newLeftNode, rightNode)
          nodeLayer.splice(nodeIndex - 1, 3, mergedNodes)
          return
        }

        nodeLayer.splice(nodeIndex - 1, 2, newLeftNode)
      }
    } else if (range.isRangeInsideNode(node.size)) {
      nodeLayer.splice(
        nodeIndex,
        0,
        this._nodeCreator.createNodeTextStyle(node.text.slice(0, range.startWithOffset), node.style),
        this._nodeCreator.createNodeText(node.text.slice(range.startWithOffset, range.endWithOffset))
      )

      node.text = node.text.slice(range.endWithOffset)
    } else if (range.isNodeStartInRange(node.size)) {
      if (leftNode !== undefined && leftNode.type === NodeType.TEXT) {
        nodeLayer.splice(
          nodeIndex - 1,
          1,
          this._nodeMerger.mergeNodeTextWithNodeTextContent(leftNode, node.text.slice(0, range.endWithOffset), true)
        )
      } else {
        nodeLayer.splice(
          nodeIndex,
          0,
          this._nodeCreator.createNodeText(node.text.slice(0, range.endWithOffset))
        )
      }

      node.text = node.text.slice(range.endWithOffset)
    } else if (range.isNodeEndInRange(node.size)) {
      if (rightNode !== undefined && rightNode.type === NodeType.TEXT) {
        nodeLayer.splice(
          nodeIndex + 1,
          1,
          this._nodeMerger.mergeNodeTextWithNodeTextContent(rightNode, node.text.slice(range.startWithOffset), false)
        )
      } else {
        nodeLayer.splice(
          nodeIndex + 1,
          0,
          this._nodeCreator.createNodeText(node.text.slice(range.startWithOffset))
        )
      }

      node.text = node.text.slice(0, range.startWithOffset)
    }
  }

  deleteTextStyle (nodeLayer: NodeChildren, linkedNode: ILinkedNodeReadonly, range: RangeWithOffset, textStyle: TextStyle): void {
    if ((linkedNode as ILinkedNodeReadonly<INodeTextStyle>).node.style.deepCompare(textStyle)) {
      this.deleteTextStyleAll(nodeLayer, linkedNode, range)
    }
  }
}