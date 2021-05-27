import { NodeRepresentation } from '../core/TextRepresentation/NodeRepresentation'
import { ISelection } from './ISelection'
import { IPoint } from './IPoint'

class TextEditorResponse {
  textCursorX: number
  textCursorY: number
  textCursorPosition: IPoint
  textLength: number
  textSelections: ISelection[]
  selectedContent: NodeRepresentation[]
}

export { TextEditorResponse }
