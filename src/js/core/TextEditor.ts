import { ITextEditor } from './ITextEditor'
import { IRange } from '../common/IRange'
import { TextStyleType } from '../common/TextStyleType'
import { TextCursor } from './TextCursor'
import { TextRepresentation } from './TextRepresentation/TextRepresentation'
import { ITextCursorPositionSubscriber } from '../common/ITextCursorPositionSubscriber'
import { ITextCursorSelectionsSubscriber } from '../common/ITextCursorSelectionsSubscriber'
import { ITextRepresentationSubscriber } from '../common/ITextRepresentationSubscriber'
import { IActiveTextStylesSubscriber } from '../common/IActiveTextStylesSubscriber'
import { RequestType } from '../common/RequestType'
import { TextEditorResponse } from '../common/TextEditorResponse'

class TextEditor implements ITextEditor {
  private readonly _textCursor: TextCursor
  private readonly _textRepresentation: TextRepresentation
  private readonly _activeTextStylesSubscribers: IActiveTextStylesSubscriber[]

  constructor () {
    this._textCursor = new TextCursor()
    this._textRepresentation = new TextRepresentation()
    this._activeTextStylesSubscribers = []
  }

  init (): void {
    this._textRepresentation.createNewLines(0, 1)
    this._textCursor.setX(0)
    this._textCursor.setY(0)
    this.updateTextRepresentation()
    this.updateTextCursorPosition()
  }

  addText (text: string): void {
    this._textRepresentation.addTextInLine(text, this._textCursor.getY(), this._textCursor.getX())
  }

  deleteTextOnTextCursor (offset: number): void {
    if (offset > 0) {
      this._textRepresentation.deleteTextInLine(
        this._textCursor.getY(),
        this._textCursor.getX(),
        this._textCursor.getX() + offset
      )
    } else {
      this._textRepresentation.deleteTextInLine(
        this._textCursor.getY(),
        this._getValidHorizontalPosition(
          this._textCursor.getY(),
          this._textCursor.getX() + offset
        ),
        this._textCursor.getX()
      )
    }
  }

  deleteTextOnSelection (): void {
    this._textRepresentation.deleteTextInRanges(this._textCursor.getSelections())
  }

  addTextStyle (textStyleType: TextStyleType): void {
    this._textRepresentation.addTextStylesInRanges(textStyleType, this._textCursor.getSelections())
  }

  removeConcreteTextStyle (textStyleType: TextStyleType): void {
    // add parameters for methods like removeConcreteTextStyleInRanges() where it will take textCursor separate from selections
    this._textRepresentation.removeConcreteTextStyleInRanges(
      textStyleType,
      [{
        startX: this._textCursor.getX(),
        endX: this._textCursor.getX(),
        startY: this._textCursor.getY(),
        endY: this._textCursor.getY()
      }].concat(this._textCursor.getSelections())
    )
  }

  removeAllTextStyles (): void {
    this._textRepresentation.removeAllTextStylesInRanges(
      [{
        startX: this._textCursor.getX(),
        endX: this._textCursor.getX(),
        startY: this._textCursor.getY(),
        endY: this._textCursor.getY()
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

  setTextCursorXPosition (position: number): void {
    this._textCursor.setX(this._getValidHorizontalPosition(this._textCursor.getY(), position))
  }

  setTextCursorYPosition (position: number): void {
    this._textCursor.setY(this._getValidVerticalPosition(position))
  }

  moveTextCursorXPosition (offset: number): void {
    this._textCursor.setX(
      this._getValidHorizontalPosition(
        this._textCursor.getY(),
        this._textCursor.getX() + offset
      )
    )
  }

  moveTextCursorYPosition (offset: number): void {
    this._textCursor.setY(
      this._getValidVerticalPosition(this._textCursor.getY() + offset)
    )
  }

  addSelections (selections: IRange[]): void {
    for (const selection of selections) {
      const validStartVerticalPosition: number = this._getValidVerticalPosition(selection.startY)
      const validEndVerticalPosition: number = this._getValidVerticalPosition(selection.endY)

      this._textCursor.addSelection({
        startX: this._getValidHorizontalPosition(validStartVerticalPosition, selection.startX),
        endX: this._getValidHorizontalPosition(validEndVerticalPosition, selection.endX),
        startY: validStartVerticalPosition,
        endY: validEndVerticalPosition
      })
    }
  }

  clearSelections (): void {
    this._textCursor.clearSelections()
  }

  createNewTextLines (count: number = 1): void {
    this._textRepresentation.createNewLines(this._textCursor.getY(), count)
  }

  deleteTextLines (offset: number, count: number = 1): void {
    // make similar to deleting text
    this._textRepresentation.deleteLines(this._textCursor.getY() + offset, count)
  }

  subscribeForTextCursorPosition (subscriber: ITextCursorPositionSubscriber): void {
    this._textCursor.subscribeForPosition(subscriber)
  }

  subscribeForTextCursorSelections (subscriber: ITextCursorSelectionsSubscriber): void {
    this._textCursor.subscribeForSelections(subscriber)
  }

  subscribeForTextRepresentation (subscriber: ITextRepresentationSubscriber): void {
    this._textRepresentation.subscribe(subscriber)
  }

  subscribeForActiveStyles (subscriber: IActiveTextStylesSubscriber): void {
    this._activeTextStylesSubscribers.push(subscriber)
  }

  updateTextCursorPosition (): void {
    this._textCursor.notifyPositionSubscribers()
  }

  updateTextCursorSelections (): void {
    this._textCursor.notifySelectionsSubscribers()
  }

  updateTextRepresentation (): void {
    // maybe delegate observer functionality to this class instead of textRepresentation
    // same for textCursor
    this._textRepresentation.notifySubscribers()
  }

  updateActiveStyles (): void {
    const activeTextStyles: TextStyleType[] = this._textRepresentation.getTextStylesInRanges(this._textCursor.getSelections())
    for (const subscriber of this._activeTextStylesSubscribers) {
      subscriber.updateActiveTextStyles(activeTextStyles)
    }
  }

  fetchData (request: RequestType): TextEditorResponse {
    const response: TextEditorResponse = new TextEditorResponse()

    switch (request) {
      case 'text-cursor-x':
        return response.setTextCursorX(this._textCursor.getX())
      case 'text-cursor-y':
        return response.setTextCursorY(this._textCursor.getY())
      case 'text-cursor-position':
        return response
          .setTextCursorX(this._textCursor.getX())
          .setTextCursorY(this._textCursor.getY())
      case 'text-length':
        return response.setTextLength(this._textRepresentation.getTextLengthInLine(this._textCursor.getY()))
      case 'text-selected':
        return response.setTextSelected('work in progress')
      case 'text-selections':
        return response.setTextSelections(this._textCursor.getSelections())
    }
  }
}

export { TextEditor }
