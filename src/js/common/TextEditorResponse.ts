import { IRange } from './IRange'

class TextEditorResponse {
  private _textCursorX: number
  private _textCursorY: number
  private _textLength: number
  private _textSelected: string
  private _textSelections: IRange[]

  setTextCursorX (x: number): TextEditorResponse {
    this._textCursorX = x
    return this
  }

  getTextCursorX (): number {
    return this._textCursorX
  }

  setTextCursorY (y: number): TextEditorResponse {
    this._textCursorY = y
    return this
  }

  getTextCursorY (): number {
    return this._textCursorY
  }

  setTextLength (length: number): TextEditorResponse {
    this._textLength = length
    return this
  }

  getTextLength (): number {
    return this._textLength
  }

  setTextSelected (text: string): TextEditorResponse {
    this._textSelected = text
    return this
  }

  getTextSelected (): string {
    return this._textSelected
  }

  setTextSelections (selections: IRange[]): TextEditorResponse {
    this._textSelections = selections
    return this
  }

  getTextSelections (): IRange[] {
    return this._textSelections
  }
}

export { TextEditorResponse }
