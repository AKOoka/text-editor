import { RangeNode } from './Nodes/RangeNode'
import { NodeRepresentation } from './Nodes/NodeRepresentation'
import { PositionNode } from './Nodes/PositionNode'
import { INodeCopy } from './Nodes/INode'
import { INodeUpdate } from './Nodes/NodeUpdatesManager'
import { TextStyle } from '../../common/TextStyle'

export interface ITextEditorRepresentationLine {
  getSize: () => number
  getContent: () => INodeCopy[]
  getContentInRange: (range: RangeNode) => INodeCopy[]
  getTextStylesInRange: (range: RangeNode) => TextStyle[]
  getRepresentation: () => NodeRepresentation
  getUpdates: () => INodeUpdate[]
  addText: (position: PositionNode, text: string) => void
  addContent: (position: PositionNode, content: INodeCopy[]) => void
  addTextStyle: (range: RangeNode, textStyle: TextStyle) => void
  deleteText: (range: RangeNode) => void
  deleteAllTextStyles: (range: RangeNode) => void
  deleteConcreteTextStyle: (range: RangeNode, textStyle: TextStyle) => void
}
