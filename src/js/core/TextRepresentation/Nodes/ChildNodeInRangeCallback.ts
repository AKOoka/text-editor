import { INode } from './INode'
import { RangeNode } from './RangeNode'

export type ChildNodeInRangeCallback<TextStyle> = (
  rangeNode: RangeNode,
  childNode: INode,
  textStyleType: TextStyle
) => INode[]
