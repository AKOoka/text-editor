import { TextStyleType } from '../common/TextStyleType'

// when i make change in INode i can return index value of changed node to make concrete change in visualization part
export interface INode<RenderOutput> {
  getSize: () => number
  getStyleType: () => TextStyleType | null
  mergeWithNode: (node: INode<HTMLElement>, joinAfter: boolean) => Array<INode<HTMLElement>>
  addText: (text: string, offset: number, position: number) => void
  removeText: (offset: number, start: number, end: number) => boolean
  addTextStyle: (offset: number, start: number, end: number, textStyleType: TextStyleType) => Array<INode<HTMLElement>>
  removeAllTextStyles: (offset: number, start: number, end: number) => Array<INode<HTMLElement>>
  removeConcreteTextStyle: (offset: number, start: number, end: number, textStyleType: TextStyleType) => Array<INode<HTMLElement>>
  textStylesInRange: (offset: number, start: number, end: number) => TextStyleType[]
  render: () => RenderOutput
}
