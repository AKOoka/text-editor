import { TextStyle } from '../../../../common/TextStyle'
import { ILinkedNodeReadonly } from '../ILinkedNode'
import { NodeChildren } from '../nodes/NodeChildren'
import { PositionWithOffset } from '../util/PositionWithOffset'
import { RangeWithOffset } from '../util/RangeWithOffset'

export interface INodeActionStrategy {
  // getContent: () => ILineContent
  // getContent: () => ILineContent<ILineWithStylesContent>
  // getContentInRange: (range: RangeWithOffset) => ILineContent<ILineWithStylesContent>
  // getTextStylesInRange: () => TextStyle[]
  addText: (linkedNode: ILinkedNodeReadonly, position: PositionWithOffset, text: string) => void
  // addContent: (position: PositionWithOffset, content: ILineContent<ILineWithStylesContent>) => void
  addTextStyle: (nodeLayer: NodeChildren, linkedNode: ILinkedNodeReadonly, range: RangeWithOffset, textStyle: TextStyle) => void
  deleteText: (nodeLayer: NodeChildren, linkedNode: ILinkedNodeReadonly, range: RangeWithOffset) => void
  deleteTextStyleAll: (nodeLayer: NodeChildren, linkedNode: ILinkedNodeReadonly, range: RangeWithOffset) => void
  deleteTextStyle: (nodeLayer: NodeChildren, linkedNode: ILinkedNodeReadonly, range: RangeWithOffset, textStyle: TextStyle) => void
}
