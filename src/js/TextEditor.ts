import { TextLine } from './TextLine'
import { ITextEditor } from './ITextEditor'
import { TextRepresentation } from './TextRepresentation'
import { ITextRepresentation } from './ITextRepresentation'
import { ITextLine } from './ITextLine'
import { TextStyle } from './TextStyle'
import { RemoveDirection } from './RemoveDirection'
import { TextCursorType } from './TextCursorType'
import { ITextCursor } from './ITextCursor'
import { TextCursorObserver } from './TextCursorObserver'

class TextEditor implements ITextEditor {
  private readonly _textCursor: ITextCursor
  private readonly _textRepresentation: ITextRepresentation

  get textRepresentation (): ITextRepresentation {
    return this._textRepresentation
  }

  get cursor (): ITextCursor {
    return this._textCursor
  }

  constructor () {
    this._textCursor = new TextCursorObserver()
    this._textRepresentation = new TextRepresentation()
    this._textRepresentation.setLine(0, new TextLine())
  }

  addText (text: string): void {
    const [start, end, linePosition] = [
      this._textCursor.getStart(),
      this._textCursor.getEnd(),
      this._textCursor.getLinePosition()
    ]

    const line: ITextLine = this._textRepresentation.getLine(linePosition)
    line.setText(line.getText().slice(0, start) + text + line.getText().slice(start))

    const newCursorPos: number = end + text.length
    this.setCursorPos(newCursorPos, newCursorPos, linePosition)
  }

  removeText (direction?: RemoveDirection): void {
    const [type, start, end, linePosition] = [
      this._textCursor.getType(),
      this._textCursor.getStart(),
      this._textCursor.getEnd(),
      this._textCursor.getLinePosition()
    ]
    const line: ITextLine = this._textRepresentation.getLine(linePosition)

    if (type === TextCursorType.Selection) {
      line.setText(line.getText().slice(0, start) + line.getText().slice(end))
      this.setCursorPos(start, start, linePosition)
      return
    }

    if (direction === RemoveDirection.Forward) {
      line.setText(line.getText().slice(0, start) + line.getText().slice(end + 1))
      return
    }

    line.setText(line.getText().slice(0, start - 1) + line.getText().slice(end))

    const newCursorPos: number = start - 1
    this.setCursorPos(newCursorPos, newCursorPos, linePosition)
  }

  addTextStyle (textStyleType: string): void {
    const [start, end, linePosition] = [
      this._textCursor.getStart(),
      this._textCursor.getEnd(),
      this._textCursor.getLinePosition()
    ]
    const line: ITextLine = this._textRepresentation.getLine(linePosition)
    line.addTextStyle(new TextStyle(start, end, textStyleType))
  }

  removeTextStyle (): void {
  }

  setCursorPos (start: number, end: number, linePosition: number): void {
    const line: ITextLine = this._textRepresentation.getLine(linePosition)

    this._textCursor.setPos(start, end, linePosition, line.getTextStylesInRange(start, end))
  }
}

export { TextEditor }
