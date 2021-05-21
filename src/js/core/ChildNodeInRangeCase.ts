import { INode } from './INode'

export type ChildNodeInRangeCase<TextStyle> = (
  childNode: INode<HTMLElement>,
  offset: number,
  start: number,
  end: number,
  textStyleType: TextStyle
) => Array<INode<HTMLElement>>
