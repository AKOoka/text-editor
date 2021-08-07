import { TextStyle } from '../../../../common/TextStyle'
import { ILinkedNodeReadonly } from '../ILinkedNode'
import { INodeText, INodeTextStyle } from '../nodes/INode'
import { INodeActionStrategy } from './INodeActionStrategy'
import { NodeCreator } from '../util/NodeCreator'
import { NodeLayer } from '../NodeLayer'
import { NodeLayerTool } from '../util/NodeLayerTool'
import { MergeResult, NodeMerger } from '../util/NodeMerger'
import { PositionWithOffset } from '../util/PositionWithOffset'
import { RangeWithOffset } from '../util/RangeWithOffset'

export abstract class BaseNodeTextActionStrategy implements INodeActionStrategy {
  protected _nodeCreator: NodeCreator
  protected _nodeMerger: NodeMerger
  protected _nodeLayerTool: NodeLayerTool

  constructor (nodeCreator: NodeCreator, nodeMerger: NodeMerger, nodeLayerTool: NodeLayerTool) {
    this._nodeCreator = nodeCreator
    this._nodeMerger = nodeMerger
    this._nodeLayerTool = nodeLayerTool
  }

  addText (linkedNode: ILinkedNodeReadonly, position: PositionWithOffset, text: string): void {
    const { node } = linkedNode as ILinkedNodeReadonly<INodeText | INodeTextStyle>
    node.text = node.text.slice(0, position.positionWithOffset) + text + node.text.slice(position.positionWithOffset)
  }

  deleteText (nodeLayer: NodeLayer, linkedNode: ILinkedNodeReadonly, range: RangeWithOffset): void {
    const { node, prev, next } = linkedNode as ILinkedNodeReadonly<INodeText>

    if (!range.isNodeInsideRange(node.size)) {
      node.text = node.text.slice(0, range.startWithOffset) + node.text.slice(range.endWithOffset)
      return
    }

    nodeLayer.delete(linkedNode)

    if (prev === null || next === null) {
      return
    }

    const mergeResult: MergeResult = this._nodeMerger.mergeIfPossibleTwoNodes(prev.node, next.node)

    if (mergeResult.success) {
      prev.node = mergeResult.node
      nodeLayer.delete(next)
    }
  }

  abstract addTextStyle (nodeLayer: NodeLayer, linkedNode: ILinkedNodeReadonly, range: RangeWithOffset, textStyle: TextStyle): void
  abstract deleteTextStyleAll (nodeLayer: NodeLayer, linkedNode: ILinkedNodeReadonly, range: RangeWithOffset): void
  abstract deleteTextStyleConcrete (nodeLayer: NodeLayer, linkedNode: ILinkedNodeReadonly, range: RangeWithOffset, textStyle: TextStyle): void
}
