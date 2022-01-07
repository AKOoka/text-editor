import { ITextEditor } from './ITextEditor'
import { Range } from '../common/Range'
import { TextEditorTextCursor } from './TextEditorTextCursor'
import { TextRepresentation } from './text-representation/TextRepresentation'
import { ITextCursorPositionSubscriber } from '../common/ITextCursorPositionSubscriber'
import { ITextCursorSelectionsSubscriber } from '../common/ITextCursorSelectionsSubscriber'
import { ITextRepresentationSubscriber } from '../common/ITextRepresentationSubscriber'
import { IActiveTextStylesSubscriber } from '../common/IActiveTextStylesSubscriber'
import { Point } from '../common/Point'
import { Selection } from '../common/Selection'
import { TextStyle } from '../common/TextStyle'
import { ILineContent } from './text-representation/ILineContent'

class TextEditor implements ITextEditor {
  private readonly _textCursor: TextEditorTextCursor
  private readonly _textRepresentation: TextRepresentation
  private readonly _activeTextStylesSubscribers: IActiveTextStylesSubscriber[]
  private readonly _context: HTMLElement

  constructor () {
    this._textCursor = new TextEditorTextCursor()
    this._textRepresentation = new TextRepresentation()
    this._activeTextStylesSubscribers = []
    this._context = document.createElement('div')
    this._context.classList.add('text-editor')
  }

  init (): void {
    this._textRepresentation.addNewLines(new Range(0, 1))
    this._textCursor.y = 0
    this.updateTextRepresentation()
    this.updateTextCursorPoint()
  }

  getHtmlContext (): HTMLElement {
    return this._context
  }

  addText (point: Point, text: string): void {
    this._textRepresentation.addTextInLine(point, text)
  }

  addContent (point: Point, content: ILineContent[]): void {
    this._textRepresentation.addContent(point, content)
  }

  addTextStyleInSelections (selections: Selection[], textStyleType: TextStyle): void {
    this._textRepresentation.addTextStylesInSelections(selections, textStyleType)
  }

  addTextCursorSelections (selections: Selection[]): void {
    this._textCursor.addSelections(selections)
  }

  addNewLinesInRange (rangeY: Range): void {
    this._textRepresentation.addNewLines(rangeY)
  }

  changeTextCursorSelection (selectionIndex: number, selection: Selection): void {
    this._textCursor.changeSelection(selectionIndex, selection)
  }

  deleteTextInRange (y: number, rangeX: Range): void {
    this._textRepresentation.deleteTextInLine(y, rangeX)
  }

  deleteTextInSelections (selections: Selection[]): void {
    this._textRepresentation.deleteTextInSelections(selections)
  }

  deleteConcreteTextStylesInSelections (selections: Selection[], textStyleType: TextStyle): void {
    this._textRepresentation.deleteConcreteTextStyleInSelections(selections, textStyleType)
  }

  deleteAllTextStylesInSelections (selections: Selection[]): void {
    this._textRepresentation.deleteAllTextStylesInSelections(selections)
  }

  deleteLinesInRange (rangeY: Range): void {
    this._textRepresentation.deleteLines(rangeY)
  }

  deleteConcreteTextCursorSelection (selectionIndex: number): void {
    this._textCursor.deleteConcreteSelection(selectionIndex)
  }

  deleteAllTextCursorSelections (): void {
    this._textCursor.deleteAllSelections()
  }

  setTextCursorX (x: number): void {
    this._textCursor.x = x
  }

  setTextCursorY (y: number): void {
    this._textCursor.y = y
  }

  setTextCursorPoint (point: Point): void {
    this._textCursor.point = point
  }

  subscribeForTextCursorPoint (subscriber: ITextCursorPositionSubscriber): void {
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

  updateTextCursorPoint (): void {
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
    const activeTextStyles: TextStyle[] = this._textRepresentation.getTextStylesInSelections(this._textCursor.selections)
    for (const subscriber of this._activeTextStylesSubscribers) {
      subscriber.updateActiveTextStyles(activeTextStyles)
    }
  }

  getTextCursorX (): number {
    return this._textCursor.x
  }

  getTextCursorY (): number {
    return this._textCursor.y
  }

  getTextCursorPoint (): Point {
    return this._textCursor.point
  }

  getLineSize (lineY: number): number {
    return this._textRepresentation.getTextLengthInLine(lineY)
  }

  getLinesCount (): number {
    return this._textRepresentation.getLinesCount()
  }

  getTextCursorSelections (): Selection[] {
    return this._textCursor.selections
  }

  getContentInSelections (selections: Selection[]): ILineContent[] {
    return this._textRepresentation.getContentInSelections(selections)
  }
}

export { TextEditor }
