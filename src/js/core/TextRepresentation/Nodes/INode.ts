import { TextStyleType } from '../../../common/TextStyleType'
import { NodeRepresentation } from '../NodeRepresentation'
import { RangeNode } from './RangeNode'
import { PositionNode } from './PositionNode'

// when i make change in INode i can return index value of changed node to make concrete change in visualization part
export interface INode {
  getSize: () => number
  getStyle: () => TextStyleType | null
  getContentInRange: (range: RangeNode) => NodeRepresentation
  getRepresentation: () => NodeRepresentation
  getTextStylesInRange: (range: RangeNode) => TextStyleType[]
  addText: (position: PositionNode, text: string) => void
  addContent: (position: PositionNode, content: NodeRepresentation[], parentTextStyles: TextStyleType[]) => INode[]
  addTextStyle: (range: RangeNode, textStyle: TextStyleType) => INode[]
  deleteText: (range: RangeNode) => boolean
  deleteAllTextStyles: (range: RangeNode) => INode[]
  deleteConcreteTextStyle: (range: RangeNode, textStyle: TextStyleType) => INode[]
  mergeWithNode: (node: INode, joinAfter: boolean) => INode[]
}
