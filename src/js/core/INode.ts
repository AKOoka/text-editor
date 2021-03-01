import { TextStyleType } from '../common/TextStyleType'

// when i make change in INode i can return index value of changed node to make concrete change in visualization part
export interface INode<RenderOutput> {
  getSize: () => number
  addText: (text: string, offset: number, position: number) => void
  removeText: (offset: number, start: number, end?: number) => boolean
  addTextStyle: (textStyleType: TextStyleType, offset: number, start: number, end?: number) => Array<INode<HTMLElement>>
  removeAllTextStyles: (offset: number, start: number, end?: number) => Array<INode<HTMLElement>>
  removeConcreteTextStyle: (textStyleType: TextStyleType, offset: number, start: number, end?: number) => Array<INode<HTMLElement>>
  textStylesInRange: (offset: number, start: number, end?: number) => TextStyleType[]
  render: () => RenderOutput
}
