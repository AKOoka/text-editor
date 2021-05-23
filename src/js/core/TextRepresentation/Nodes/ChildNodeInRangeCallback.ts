import { INode } from './INode'

export type ChildNodeInRangeCallback<TextStyle> = (
  childNode: INode,
  offset: number,
  start: number,
  end: number,
  textStyleType: TextStyle
) => INode[]
