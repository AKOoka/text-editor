import { ITextEditor } from './ITextEditor'
import { ITextRepresentation } from './ITextRepresentation'
import { ITextCursor } from './ITextCursor'
import { IRange } from '../common/IRange'

class TextEditor implements ITextEditor {
  private readonly _textCursor: ITextCursor
  private readonly _textRepresentation: ITextRepresentation

  constructor (textCursor: ITextCursor, textRepresentation: ITextRepresentation) {
    this._textCursor = textCursor
    this._textRepresentation = textRepresentation
  }

  addText (text: string): void {
    this._textRepresentation.addTextInLine(text, this._textCursor.getLinePosition(), this._textCursor.getPosition())
  }

  removeTextOnTextCursor (offset: number): void {
    this._textRepresentation.deleteTextInLine(
      this._textCursor.getLinePosition(),
      offset > 0 ? this._textCursor.getPosition() : this._textCursor.getPosition() + offset,
      offset > 0 ? this._textCursor.getPosition() + offset : this._textCursor.getPosition()
    )
  }

  removeTextOnSelection (): void {
    this._textRepresentation.deleteTextInRanges(this._textCursor.getSelections())
  }

  getTextStylesOnCursor (): void {}

  addTextStyle (textStyleType: string): void {
    // const textCursorPositions: IRange[] = [
    //   {
    //     start: this._textCursor.getPosition(),
    //     end: this._textCursor.getPosition(),
    //     startLinePosition: this._textCursor.getLinePosition(),
    //     endLinePosition: this._textCursor.getLinePosition()
    //   }
    // ].concat(this._textCursor.getSelections())
    // this._textRepresentation.addTextStylesInRanges(textStyleType, textCursorPositions)
    this._textRepresentation.addTextStylesInRanges(textStyleType, this._textCursor.getSelections())
  }

  removeTextStyle (textStyleType: string): void {
    const textCursorPositions: IRange[] = [
      {
        start: this._textCursor.getPosition(),
        end: this._textCursor.getPosition(),
        startLinePosition: this._textCursor.getLinePosition(),
        endLinePosition: this._textCursor.getLinePosition()
      }
    ].concat(this._textCursor.getSelections())
    this._textRepresentation.removeTextStylesInRanges(textStyleType, textCursorPositions)
  }

  setTextCursorPos (position: number, linePosition: number): void {
    this._textCursor.setPos(position, linePosition)
  }

  horMoveTextCursor (offset: number): void {
    const newPosition = this._textCursor.getPosition() + offset
    this._textCursor.setPos(newPosition, this._textCursor.getLinePosition())
  }

  verMoveTextCursor (offset: number): void {
    const newLinePosition = this._textCursor.getLinePosition() + offset
    this._textCursor.setPos(this._textCursor.getPosition(), newLinePosition)
  }

  addSelection (selection: IRange): void {
    this._textCursor.addSelection(selection)
  }

  clearSelections (): void {
    this._textCursor.clearSelections()
  }

  createNewTextLines (count: number = 1): void {
    this._textRepresentation.createNewLines(this._textCursor.getPosition(), count)
  }

  removeTextLines (count: number = 1): void {
    this._textRepresentation.deleteLines(this._textCursor.getPosition(), count)
  }

  updateTextCursor (): void {
    this._textCursor.updateSubscribers()
  }

  updateTextRepresentation (): void {
    this._textRepresentation.updateSubscribers()
  }
}

export { TextEditor }
