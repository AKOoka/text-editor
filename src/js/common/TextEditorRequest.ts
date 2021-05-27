import { Range } from './Range'
import { TextEditorRequestType } from './TextEditorRequestType'

class TextEditorRequestPayload {
  ranges: Range[]
}

class TextEditorRequest {
  type: TextEditorRequestType
  payload: TextEditorRequestPayload
}

export { TextEditorRequest }
