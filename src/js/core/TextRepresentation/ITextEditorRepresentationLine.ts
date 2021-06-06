import { RangeNode } from './Nodes/RangeNode'
import { TextStyleType } from '../../common/TextStyleType'
import { NodeRepresentation } from './NodeRepresentation'
import { PositionNode } from './Nodes/PositionNode'
import { INodeCopy } from './Nodes/INode'
import { INodeUpdate } from './Nodes/NodeUpdatesManager'

export interface ITextEditorRepresentationLine {
  getSize: () => number
  getContent: () => INodeCopy[]
  getContentInRange: (range: RangeNode) => INodeCopy[]
  getTextStylesInRange: (range: RangeNode) => TextStyleType[]
  getRepresentation: () => NodeRepresentation
  getUpdates: () => INodeUpdate[]
  addText: (position: PositionNode, text: string) => void
  addContent: (position: PositionNode, content: INodeCopy[]) => void
  addTextStyle: (range: RangeNode, textStyle: TextStyleType) => void
  deleteText: (range: RangeNode) => void
  deleteAllTextStyles: (range: RangeNode) => void
  deleteConcreteTextStyle: (range: RangeNode, textStyle: TextStyleType) => void
}
