import { RangeNode } from './RangeNode'
import { PositionNode } from './PositionNode'
import { NodeRepresentation } from './NodeRepresentation'
import { TextStyle } from '../../../common/TextStyle'

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
  getContentInRange: (range: RangeNode) => INodeCopy[]
  getTextStylesInRange: (range: RangeNode) => TextStyle[]
  getRepresentation: () => NodeRepresentation
  addText: (position: PositionNode, text: string) => void
  addContent: (position: PositionNode, content: INodeCopy[], parentTextStyles: TextStyle[]) => CreatedContent
  addTextStyle: (range: RangeNode, textStyle: TextStyle) => INode[]
  deleteText: (range: RangeNode) => boolean
  deleteAllTextStyles: (range: RangeNode) => INode[]
  deleteConcreteTextStyle: (range: RangeNode, textStyle: TextStyle) => INode[]
}
