import { RangeWithOffset } from '../../../common/RangeWithOffset'
import { PositionWithOffset } from '../../../common/PositionWithOffset'
import { NodeRepresentation } from './NodeRepresentation'
import { TextStyle } from '../../../common/TextStyle'

// TODO: choose between INodeCopy and INodeRepresentation for usage

export interface INodeCopyProps {
  text?: string
  textStyle?: TextStyle
  children?: INodeCopy[]
}

export interface INodeTextCopyProps extends INodeCopyProps{
  text: string
}

export interface INodeTextStyleCopyProps extends INodeCopyProps{
  text: string
  textStyle: TextStyle
}

export interface INodeContainerStyleProps extends INodeCopyProps {
  children: INodeCopy[]
  textStyle: TextStyle
}

export interface INodeCopy<Props extends INodeCopyProps = INodeCopyProps> {
  type: NodeType
  size: number
  props: Props
}

export interface CreatedContent {
  nodes: INode[]
  nodeStyles: TextStyle[]
}

export enum NodeType {
  CONTAINER_LINE,
  CONTAINER_STYLE,
  TEXT_STYLE,
  TEXT
}

export interface INode {
  getSize: () => number
  getStyle: () => TextStyle | null
  getNodeType: () => NodeType
  getContent: () => INodeCopy[]
  getContentInRange: (range: RangeWithOffset) => INodeCopy[]
  getTextStylesInRange: (range: RangeWithOffset) => TextStyle[]
  getRepresentation: () => NodeRepresentation
  addText: (position: PositionWithOffset, text: string) => void
  addContent: (position: PositionWithOffset, content: INodeCopy[], parentTextStyles: TextStyle[]) => CreatedContent
  addTextStyle: (range: RangeWithOffset, textStyle: TextStyle) => INode[]
  deleteText: (range: RangeWithOffset) => boolean
  deleteTextStyleAll: (range: RangeWithOffset) => INode[]
  deleteTextStyleConcrete: (range: RangeWithOffset, textStyle: TextStyle) => INode[]
}
