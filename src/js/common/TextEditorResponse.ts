import { IRange } from './IRange'
import { NodeRepresentation } from '../core/TextRepresentation/Nodes/NodeRepresentation'

class TextEditorResponse {
  textCursorX: number
  textCursorY: number
  textCursorPosition: { x: number, y: number }
  textLength: number
  textSelections: IRange[]
  selectedContent: NodeRepresentation[]
}

export { TextEditorResponse }
