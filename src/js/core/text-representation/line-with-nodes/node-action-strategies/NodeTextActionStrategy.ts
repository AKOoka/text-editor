import { TextStyle } from '../../../../common/TextStyle'
import { BaseNodeTextActionStrategy } from './BaseNodeTextActionStrategy'
import { RangeWithOffset } from '../util/RangeWithOffset'
import { NodeLayer } from '../NodeLayer'
import { ILinkedNodeReadonly } from '../ILinkedNode'

export class NodeTextActionStrategy extends BaseNodeTextActionStrategy {
  // getContent (): ILineContent<ILineWithStylesContent> {}

  // addContent (nodeLayer: INode[], nodeIndex: number, position: PositionWithOffset, content: ILineContent<ILineWithStylesContent>): void {

  // }

  addTextStyle (nodeLayer: NodeLayer, linkedNode: ILinkedNodeReadonly, range: RangeWithOffset, textStyle: TextStyle): void {
    const { node } = linkedNode

    if (range.isNodeInsideRange(node.size)) {
      this._nodeLayerTool.replaceNodeTextWithNodeTextStyle(nodeLayer, linkedNode, textStyle)
    } else if (range.isRangeInsideNode(node.size)) {
      this._nodeLayerTool.replaceNodeTextPartMiddleWithNodeTextStyle(nodeLayer, linkedNode, range, textStyle)
    } else if (range.isNodeStartInRange(node.size)) {
      this._nodeLayerTool.replaceNodeTextPartLeftWithNodeTextStyle(
        nodeLayer,
        linkedNode,
        range.endWithOffset,
        textStyle
      )
    } else if (range.isNodeEndInRange(node.size)) {
      this._nodeLayerTool.replaceNodeTextPartRightWithNodeTextStyle(
        nodeLayer,
        linkedNode,
        range.startWithOffset,
        textStyle
      )
    } else {
      throw new Error(
        `cant apply style(${textStyle.property}: ${textStyle.value}) to NodeText ` +
        `at start ${range.start}, end: ${range.end}, offset: ${range.offset}`
      )
    }
  }

  deleteTextStyleAll (): void {}
  deleteTextStyleConcrete (): void {}
}
