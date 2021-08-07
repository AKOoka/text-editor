import { TextStyle } from '../../../../common/TextStyle'
import { NodeLayer } from '../NodeLayer'

export enum NodeType {
  CONTAINER,
  TEXT_STYLE,
  TEXT
}

export interface INode {
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
  childNodes: NodeLayer
}

export type Node = INodeText | INodeTextStyle | INodeContainer
