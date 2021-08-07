import { TextStyle } from '../../../../common/TextStyle'
import { ILinkedNodeReadonly } from '../ILinkedNode'
import { NodeLayer } from '../NodeLayer'
import { PositionWithOffset } from '../util/PositionWithOffset'
import { RangeWithOffset } from '../util/RangeWithOffset'

export interface INodeActionStrategy {
  // getContent: () => ILineContent
  // getContent: () => ILineContent<ILineWithStylesContent>
  // getContentInRange: (range: RangeWithOffset) => ILineContent<ILineWithStylesContent>
  // getTextStylesInRange: () => TextStyle[]
  addText: (linkedNode: ILinkedNodeReadonly, position: PositionWithOffset, text: string) => void
  // addContent: (position: PositionWithOffset, content: ILineContent<ILineWithStylesContent>) => void
  addTextStyle: (nodeLayer: NodeLayer, linkedNode: ILinkedNodeReadonly, range: RangeWithOffset, textStyle: TextStyle) => void
  deleteText: (nodeLayer: NodeLayer, linkedNode: ILinkedNodeReadonly, range: RangeWithOffset) => void
  deleteTextStyleAll: (nodeLayer: NodeLayer, linkedNode: ILinkedNodeReadonly, range: RangeWithOffset) => void
  deleteTextStyleConcrete: (nodeLayer: NodeLayer, linkedNode: ILinkedNodeReadonly, range: RangeWithOffset, textStyle: TextStyle) => void
}
