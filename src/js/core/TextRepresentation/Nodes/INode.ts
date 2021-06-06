import { TextStyleType } from '../../../common/TextStyleType'
import { RangeNode } from './RangeNode'
import { PositionNode } from './PositionNode'
import { NodeUpdatesManager } from './NodeUpdatesManager'
import { NodeType } from './NodeType'
import { NodeRepresentation } from './NodeRepresentation'
import { CreatedContent } from './CreatedContent'

export interface INodeCopyProps {
  text?: string
  textStyle?: TextStyleType
  children?: INodeCopy[]
}

export interface INodeTextCopyProps extends INodeCopyProps{
  text: string
}

export interface INodeTextStyleCopyProps extends INodeCopyProps{
  text: string
  textStyle: TextStyleType
}

export interface INodeContainerStyleProps extends INodeCopyProps {
  children: INodeCopy[]
  textStyle: TextStyleType
}

export interface INodeCopy<Props extends INodeCopyProps = INodeCopyProps> {
  type: NodeType
  size: number
  props: Props
}

export interface INode {
  getSize: () => number
  getStyle: () => TextStyleType | null
  getNodeType: () => NodeType
  getContent: () => INodeCopy[]
  getContentInRange: (range: RangeNode) => INodeCopy[]
  getTextStylesInRange: (range: RangeNode) => TextStyleType[]
  getRepresentation: () => NodeRepresentation
  addText: (position: PositionNode, text: string, nodeUpdatesManager: NodeUpdatesManager) => void
  addContent: (position: PositionNode, content: INodeCopy[], parentTextStyles: TextStyleType[], nodeUpdatesManager: NodeUpdatesManager) => CreatedContent
  addTextStyle: (range: RangeNode, textStyle: TextStyleType, nodeUpdatesManager: NodeUpdatesManager) => INode[]
  deleteText: (range: RangeNode, nodeUpdatesManager: NodeUpdatesManager) => boolean
  deleteAllTextStyles: (range: RangeNode, nodeUpdatesManager: NodeUpdatesManager) => INode[]
  deleteConcreteTextStyle: (range: RangeNode, textStyle: TextStyleType, nodeUpdatesManager: NodeUpdatesManager) => INode[]
}
