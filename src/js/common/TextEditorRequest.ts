import { TextEditorRequestType } from './TextEditorRequestType'
import { TextEditorRequestPayload } from './TextEditorRequestPayload'

class TextEditorRequest {
  type: TextEditorRequestType
  payload: TextEditorRequestPayload

  constructor (type: TextEditorRequestType) {
    this.type = type
  }

  static NewWithPayload (type: TextEditorRequestType, payload: TextEditorRequestPayload): TextEditorRequest {
    const request: TextEditorRequest = new TextEditorRequest(type)
    request.payload = payload
    return request
  }
}

export { TextEditorRequest }
