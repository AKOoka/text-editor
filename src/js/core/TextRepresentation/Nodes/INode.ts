import { TextStyleType } from '../../../common/TextStyleType'
import { NodeRepresentation } from './NodeRepresentation'

// when i make change in INode i can return index value of changed node to make concrete change in visualization part
export interface INode {
  getSize: () => number
  getStyle: () => TextStyleType | null
  mergeWithNode: (node: INode, joinAfter: boolean) => INode[]
  addText: (text: string, offset: number, position: number) => void
  removeText: (offset: number, start: number, end: number) => boolean
  addTextStyle: (offset: number, start: number, end: number, textStyle: TextStyleType) => INode[]
  removeAllTextStyles: (offset: number, start: number, end: number) => INode[]
  removeConcreteTextStyle: (offset: number, start: number, end: number, textStyle: TextStyleType) => INode[]
  textStylesInRange: (offset: number, start: number, end: number) => TextStyleType[]
  getRepresentation: () => NodeRepresentation
}
