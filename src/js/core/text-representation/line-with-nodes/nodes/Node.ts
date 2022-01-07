import { TextStyle } from '../../../../common/TextStyle'
import { NodeChildren } from './NodeChildren'

export enum NodeType {
  CONTAINER,
  TEXT_STYLE,
  TEXT
}

interface INode {
  type: NodeType
  size: number
}

export interface INodeText extends INode {
  type: NodeType.TEXT
  text: string
}

export interface INodeTextStyle extends INode {
  type: NodeType.TEXT_STYLE
  text: string
  style: TextStyle
}

export interface INodeContainer extends INode {
  type: NodeType.CONTAINER
  style: TextStyle
  childNodes: NodeChildren
}

export type Node = INodeText | INodeTextStyle | INodeContainer
