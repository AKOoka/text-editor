import { TextStyleType } from '../../../common/TextStyleType'
import { NodeRepresentation } from './NodeRepresentation'

// when i make change in INode i can return index value of changed node to make concrete change in visualization part
export interface INode {
  getSize: () => number
  getStyle: () => TextStyleType | null
  mergeWithNode: (node: INode, joinAfter: boolean) => INode[]
  addText: (text: string, offset: number, x: number) => void
  removeText: (offset: number, startX: number, endX: number) => boolean
  addTextStyle: (offset: number, startX: number, endX: number, textStyle: TextStyleType) => INode[]
  removeAllTextStyles: (offset: number, startX: number, endX: number) => INode[]
  removeConcreteTextStyle: (offset: number, startX: number, endX: number, textStyle: TextStyleType) => INode[]
  textStylesInRange: (offset: number, startX: number, endX: number) => TextStyleType[]
  getContentInRange: (offset: number, startX: number, endX: number) => NodeRepresentation
  addContent: (content: NodeRepresentation[], offset: number, x: number, parentTextStyles: TextStyleType[]) => INode[]
  getRepresentation: () => NodeRepresentation
}
