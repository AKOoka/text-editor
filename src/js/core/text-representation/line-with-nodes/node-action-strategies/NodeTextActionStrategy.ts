import { TextStyle } from '../../../../common/TextStyle'
import { BaseNodeTextActionStrategy } from './BaseNodeTextActionStrategy'
import { RangeWithOffset } from '../util/RangeWithOffset'
import { NodeChildren } from '../nodes/NodeChildren'
import { ILinkedNodeReadonly } from '../ILinkedNode'

export class NodeTextActionStrategy extends BaseNodeTextActionStrategy {
  // getContent (): ILineContent<ILineWithStylesContent> {}

  // addContent (nodeLayer: INode[], nodeIndex: number, position: PositionWithOffset, content: ILineContent<ILineWithStylesContent>): void {

  // }

  addTextStyle (nodeChildrenContainer: NodeChildren, linkedNode: ILinkedNodeReadonly, range: RangeWithOffset, textStyle: TextStyle): void {
    const { node } = linkedNode

    if (range.isNodeInsideRange(node.size)) {
      this._nodeChildrenTool.replaceNodeTextWithNodeTextStyle(nodeChildrenContainer, linkedNode, textStyle)
      return
    }

    if (range.isRangeInsideNode(node.size)) {
      this._nodeChildrenTool.replaceNodeTextPartMiddleWithNodeTextStyle(nodeChildrenContainer, linkedNode, range, textStyle)
      return
    }

    if (range.isNodeStartInRange(node.size)) {
      this._nodeChildrenTool.replaceNodeTextPartLeftWithNodeTextStyle(
        nodeChildrenContainer,
        linkedNode,
        range.endWithOffset,
        textStyle
      )
      return
    }

    if (range.isNodeEndInRange(node.size)) {
      this._nodeChildrenTool.replaceNodeTextPartRightWithNodeTextStyle(
        nodeChildrenContainer,
        linkedNode,
        range.startWithOffset,
        textStyle
      )
      return
    }

    throw new Error(
      `cant apply style(${textStyle.property}: ${textStyle.value}) to NodeText ` +
      `at start ${range.start}, end: ${range.end}, offset: ${range.offset}`
    )
  }

  deleteTextStyleAll (): void {}
  deleteTextStyle (): void {}
}
