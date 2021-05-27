import { ITextEditor } from './ITextEditor'
import { Range } from '../common/Range'
import { TextStyleType } from '../common/TextStyleType'
import { TextCursor } from './TextCursor'
import { TextRepresentation } from './TextRepresentation/TextRepresentation'
import { ITextCursorPositionSubscriber } from '../common/ITextCursorPositionSubscriber'
import { ITextCursorSelectionsSubscriber } from '../common/ITextCursorSelectionsSubscriber'
import { ITextRepresentationSubscriber } from '../common/ITextRepresentationSubscriber'
import { IActiveTextStylesSubscriber } from '../common/IActiveTextStylesSubscriber'
import { TextEditorResponse } from '../common/TextEditorResponse'
import { NodeRepresentation } from './TextRepresentation/NodeRepresentation'
import { IPoint } from '../common/IPoint'
import { ISelection } from '../common/ISelection'
import { TextEditorRequestType } from '../common/TextEditorRequestType'

class TextEditor implements ITextEditor {
  private readonly _textCursor: TextCursor
  private readonly _textRepresentation: TextRepresentation
  private readonly _activeTextStylesSubscribers: IActiveTextStylesSubscriber[]
  private readonly _context: HTMLElement

  constructor () {
    this._textCursor = new TextCursor()
    this._textRepresentation = new TextRepresentation()
    this._activeTextStylesSubscribers = []
    this._context = document.createElement('div')
    this._context.classList.add('text-editor')
  }

  private _getValidY (y: number): number {
    const lineCount: number = this._textRepresentation.getLinesCount()
    if (y < 0) {
      return 0
    } else if (y < lineCount) {
      return y
    } else {
      return lineCount - 1
    }
  }

  private _getValidX (y: number, x: number): number {
    const textLength: number = this._textRepresentation.getTextLengthInLine(y)
    if (x < 0) {
      return 0
    } else if (x <= textLength) {
      return x
    } else {
      return textLength
    }
  }

  init (): void {
    this._textRepresentation.addNewLines(new Range(0, 1))
    this._textCursor.y = 0
    this.updateTextRepresentation()
    this.updateTextCursorPosition()
  }

  getContext (): HTMLElement {
    return this._context
  }

  addText (point: IPoint, text: string): void {
    this._textRepresentation.addTextInLine(point, text)
  }

  addContent (point: IPoint, content: NodeRepresentation[]): void {
    this._textRepresentation.addContent(point, content)
  }

  addTextStyleInSelections (selections: ISelection[], textStyleType: TextStyleType): void {
    this._textRepresentation.addTextStylesInSelections(selections, textStyleType)
  }

  addTextCursorSelections (selections: ISelection[]): void {
    this._textCursor.addSelections(selections)
    // for (const selection of selections) {
    //   const validStartY: number = this._getValidY(selection.rangeY)
    //   const validEndY: number = this._getValidY(selection.endY)
    //
    //   this._textCursor.addSelection({
    //     x: this._getValidX(validStartY, selection.rangeX),
    //     y: validStartY,
    //     endX: this._getValidX(validEndY, selection.endX),
    //     endY: validEndY
    //   })
    // }
  }

  addNewLinesInRange (rangeY: Range): void {
    this._textRepresentation.addNewLines(rangeY)
  }

  deleteTextInRange (y: number, rangeX: Range): void {
    this._textRepresentation.deleteTextInLine(y, rangeX)
  }

  deleteTextInSelections (selections: ISelection[]): void {
    this._textRepresentation.deleteTextInSelections(selections)
  }

  deleteConcreteTextStylesInSelections (selections: ISelection[], textStyleType: TextStyleType): void {
    this._textRepresentation.deleteConcreteTextStyleInSelections(selections, textStyleType)
    // this._textRepresentation.deleteConcreteTextStyleInSelections(
    //   textStyleType,
    //   [{
    //     startX: this._textCursor.getX(),
    //     endX: this._textCursor.getX(),
    //     startY: this._textCursor.getY(),
    //     endY: this._textCursor.getY()
    //   }].concat(this._textCursor.getSelections())
    // )
  }

  deleteAllTextStylesInSelections (selections: ISelection[]): void {
    // this._textRepresentation.deleteAllTextStylesInSelections(
    //   [{
    //     startX: this._textCursor.getX(),
    //     endX: this._textCursor.getX(),
    //     startY: this._textCursor.getY(),
    //     endY: this._textCursor.getY()
    //   }].concat(this._textCursor.getSelections())
    // )
    this._textRepresentation.deleteAllTextStylesInSelections(selections)
  }

  deleteLinesInRange (rangeY: Range): void {
    this._textRepresentation.deleteLines(rangeY)
  }

  deleteTextCursorSelections (): void {
    this._textCursor.deleteSelections()
  }

  setTextCursorX (x: number): void {
    this._textCursor.x = this._getValidX(this._textCursor.y, x)
  }

  setTextCursorY (y: number): void {
    this._textCursor.y = this._getValidY(y)
  }

  setTextCursorPosition (position: IPoint): void {
    this._textCursor.position = position
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
    const activeTextStyles: TextStyleType[] = this._textRepresentation.getTextStylesInSelections(this._textCursor.selections)
    for (const subscriber of this._activeTextStylesSubscribers) {
      subscriber.updateActiveTextStyles(activeTextStyles)
    }
  }

  fetchData (request: TextEditorRequestType): TextEditorResponse {
    const response: TextEditorResponse = new TextEditorResponse()

    switch (request) {
      case 'textCursorX':
        response.textCursorX = this._textCursor.x
        break
      case 'textCursorY':
        response.textCursorY = this._textCursor.y
        break
      case 'textCursorPosition':
        response.textCursorPosition = this._textCursor.position
        break
      case 'textLength':
        response.textLength = this._textRepresentation.getTextLengthInLine(this._textCursor.y)
        break
      case 'selectedContent':
        response.selectedContent = this._textRepresentation.getContentInSelections(this._textCursor.selections)
        break
      case 'textSelections':
        response.textSelections = [...this._textCursor.selections]
        break
    }

    return response
  }
}

export { TextEditor }
