import { ITextEditor } from './ITextEditor'
import { ITextRepresentation } from './ITextRepresentation'
import { ITextCursor } from './ITextCursor'
import { IRange } from '../common/IRange'
import {TextStyleType} from "../common/TextStyleType";

class TextEditor implements ITextEditor {
  private readonly _textCursor: ITextCursor
  private readonly _textRepresentation: ITextRepresentation

  constructor (textCursor: ITextCursor, textRepresentation: ITextRepresentation) {
    this._textCursor = textCursor
    this._textRepresentation = textRepresentation
  }

  addText (text: string): void {
    this._textRepresentation.addTextInLine(text, this._textCursor.getVerticalPosition(), this._textCursor.getHorizontalPosition())
  }

  deleteTextOnTextCursor (offset: number): boolean {
    if (offset > 0) {
      return this._textRepresentation.deleteTextInLine(
        this._textCursor.getVerticalPosition(),
        this._textCursor.getHorizontalPosition(),
        this._textCursor.getHorizontalPosition() + offset
      )
    } else {
      return this._textRepresentation.deleteTextInLine(
        this._textCursor.getVerticalPosition(),
        this._textCursor.getHorizontalPosition() + offset,
        this._textCursor.getHorizontalPosition()
      )
    }
  }

  deleteTextOnSelection (): void {
    this._textRepresentation.deleteTextInRanges(this._textCursor.getSelections())
  }

  getTextStylesOnCursor (): void {}

  addTextStyle (textStyleType: TextStyleType): void {
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

  removeConcreteTextStyle (textStyleType: TextStyleType): void {
    this._textRepresentation.removeConcreteTextStyleInRanges(
      textStyleType,
      [{
        start: this._textCursor.getHorizontalPosition(),
        end: this._textCursor.getHorizontalPosition(),
        startLinePosition: this._textCursor.getVerticalPosition(),
        endLinePosition: this._textCursor.getVerticalPosition()
      }].concat(this._textCursor.getSelections())
    )
  }

  removeAllTextStyles (): void {
    this._textRepresentation.removeAllTextStylesInRanges(
      [{
        start: this._textCursor.getHorizontalPosition(),
        end: this._textCursor.getHorizontalPosition(),
        startLinePosition: this._textCursor.getVerticalPosition(),
        endLinePosition: this._textCursor.getVerticalPosition()
      }].concat(this._textCursor.getSelections())
    )
  }

  private _getValidVerticalPosition (position: number): number {
    const lineCount: number = this._textRepresentation.getLinesCount()
    if (position < 0) {
      return 0
    } else if (position < lineCount) {
      return position
    } else {
      return lineCount - 1
    }
  }

  private _getValidHorizontalPosition (verticalPosition: number, horizontalPosition: number): number {
    const textLength: number = this._textRepresentation.getTextLengthInLine(verticalPosition)
    if (horizontalPosition < 0) {
      return 0
    } else if (horizontalPosition <= textLength) {
      return horizontalPosition
    } else {
      return textLength
    }
  }

  setHorizontalPositionTextCursor (position: number): void {
    this._textCursor.setHorizontalPosition(
      this._getValidHorizontalPosition(this._textCursor.getVerticalPosition(), position)
    )
  }

  setVerticalPositionTextCursor (position: number): void {
    this._textCursor.setVerticalPosition(this._getValidVerticalPosition(position))
  }

  horizontalMoveTextCursor (offset: number): void {
    this._textCursor.setHorizontalPosition(
      this._getValidHorizontalPosition(
        this._textCursor.getVerticalPosition(),
        this._textCursor.getHorizontalPosition() + offset
      )
    )
  }

  verticalMoveTextCursor (offset: number): void {
    this._textCursor.setVerticalPosition(
      this._getValidVerticalPosition(this._textCursor.getVerticalPosition() + offset)
    )
  }

  addSelection (selection: IRange): void {
    const validStartVerticalPosition: number = this._getValidVerticalPosition(selection.startLinePosition)
    const validEndVerticalPosition: number = this._getValidVerticalPosition(selection.endLinePosition)

    this._textCursor.addSelection({
      start: this._getValidHorizontalPosition(validStartVerticalPosition, selection.start),
      end: this._getValidHorizontalPosition(validEndVerticalPosition, selection.end),
      startLinePosition: validStartVerticalPosition,
      endLinePosition: validEndVerticalPosition
    })
  }

  clearSelections (): void {
    this._textCursor.clearSelections()
  }

  createNewTextLines (count: number = 1): void {
    this._textRepresentation.createNewLines(this._textCursor.getVerticalPosition(), count)
  }

  deleteTextLines (offset: number, count: number = 1): void {
    // make similar to deleting text
    this._textRepresentation.deleteLines(this._textCursor.getVerticalPosition() + offset, count)
  }

  updateTextCursor (): void {
    this._textCursor.updateSubscribers()
  }

  updateTextRepresentation (): void {
    this._textRepresentation.updateSubscribers()
  }
}

export { TextEditor }
