import { TextCursorType } from './TextCursorType'
import { ITextCursor } from './ITextCursor'
import { ITextStyle } from './ITextStyle'

class TextCursor implements ITextCursor {
  private _type: TextCursorType
  private _start: number
  private _end: number
  private _linePosition: number
  private _textStyles: ITextStyle[]

  getType (): TextCursorType {
    return this._type
  }

  getStart (): number {
    return this._start
  }

  getEnd (): number {
    return this._end
  }

  getLinePosition (): number {
    return this._linePosition
  }

  getTextStyles (): ITextStyle[] {
    return this._textStyles
  }

  constructor () {
    this._type = TextCursorType.Caret
    this._start = 0
    this._end = 0
    this._linePosition = 0
    this._textStyles = []
  }

  setPos (start: number, end: number, linePosition: number, textStyles: ITextStyle[]): void {
    this._start = start
    this._end = end
    this._linePosition = linePosition
    this._type = start === end ? TextCursorType.Caret : TextCursorType.Selection
    this._textStyles = textStyles
  }
}

export { TextCursor }
