import { IPoint } from './IPoint'
import { ISelection } from './ISelection'

class TextEditorRequestPayload {
  x: number
  y: number
  position: IPoint
  selections: ISelection[]

  static NewWithY (y: number): TextEditorRequestPayload {
    const payload: TextEditorRequestPayload = new TextEditorRequestPayload()
    payload.y = y
    return payload
  }

  static NewWithSelections (selections: ISelection[]): TextEditorRequestPayload {
    const payload: TextEditorRequestPayload = new TextEditorRequestPayload()
    payload.selections = selections
    return payload
  }
}

export { TextEditorRequestPayload }
