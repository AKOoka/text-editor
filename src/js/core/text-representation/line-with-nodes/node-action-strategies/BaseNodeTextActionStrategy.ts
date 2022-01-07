import { TextStyle } from '../../../../common/TextStyle'
import { ILinkedNodeReadonly } from '../ILinkedNode'
import { INodeText, INodeTextStyle } from '../nodes/Node'
import { INodeActionStrategy } from './INodeActionStrategy'
import { NodeCreator } from '../util/NodeCreator'
import { NodeChildren } from '../nodes/NodeChildren'
import { NodeChildrenTool } from '../util/NodeChildrenTool'
import { MergeResult } from '../util/merger/NodeMerger'
import { PositionWithOffset } from '../util/PositionWithOffset'
import { RangeWithOffset } from '../util/RangeWithOffset'

export abstract class BaseNodeTextActionStrategy implements INodeActionStrategy {
  protected _nodeCreator: NodeCreator
  protected _nodeChildrenTool: NodeChildrenTool

  constructor (nodeCreator: NodeCreator, nodeChildrenTool: NodeChildrenTool) {
    this._nodeCreator = nodeCreator
    this._nodeChildrenTool = nodeChildrenTool
  }

  addText (linkedNode: ILinkedNodeReadonly, position: PositionWithOffset, text: string): void {
    const { node } = linkedNode as ILinkedNodeReadonly<INodeText | INodeTextStyle>
    node.text = node.text.slice(0, position.positionWithOffset) + text + node.text.slice(position.positionWithOffset)
  }

  deleteText (nodeChildren: NodeChildren, linkedNode: ILinkedNodeReadonly, range: RangeWithOffset): void {
    const { node, prev, next } = linkedNode as ILinkedNodeReadonly<INodeText>

    if (!range.isNodeInsideRange(node.size)) {
      node.text = node.text.slice(0, range.startWithOffset) + node.text.slice(range.endWithOffset)
      return
    }

    nodeChildren.delete(linkedNode)

    if (prev === null || next === null) {
      return
    }

    const mergeResult: MergeResult = this._nodeChildrenTool.mergeIfPossibleTwoNodes(prev.node, next.node)

    if (mergeResult.success) {
      prev.node = mergeResult.node
      nodeChildren.delete(next)
    }
  }

  abstract addTextStyle (nodeLayer: NodeChildren, linkedNode: ILinkedNodeReadonly, range: RangeWithOffset, textStyle: TextStyle): void
  abstract deleteTextStyleAll (nodeLayer: NodeChildren, linkedNode: ILinkedNodeReadonly, range: RangeWithOffset): void
  abstract deleteTextStyle (nodeLayer: NodeChildren, linkedNode: ILinkedNodeReadonly, range: RangeWithOffset, textStyle: TextStyle): void
}
