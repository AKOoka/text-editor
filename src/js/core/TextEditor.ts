import { ITextEditor } from './ITextEditor'
import { Range } from '../common/Range'
import { TextEditorTextCursor } from './TextEditorTextCursor'
import { TextEditorRepresentation } from './TextRepresentation/TextEditorRepresentation'
import { ITextCursorPositionSubscriber } from '../common/ITextCursorPositionSubscriber'
import { ITextCursorSelectionsSubscriber } from '../common/ITextCursorSelectionsSubscriber'
import { ITextRepresentationSubscriber } from '../common/ITextRepresentationSubscriber'
import { IActiveTextStylesSubscriber } from '../common/IActiveTextStylesSubscriber'
import { Point } from '../common/Point'
import { Selection } from '../common/Selection'
import { INodeCopy } from './TextRepresentation/Nodes/INode'
import { TextStyle } from '../common/TextStyle'

class TextEditor implements ITextEditor {
  private readonly _textCursor: TextEditorTextCursor
  private readonly _representation: TextEditorRepresentation
  private readonly _activeTextStylesSubscribers: IActiveTextStylesSubscriber[]
  private readonly _context: HTMLElement

  constructor () {
    this._textCursor = new TextEditorTextCursor()
    this._representation = new TextEditorRepresentation()
    this._activeTextStylesSubscribers = []
    this._context = document.createElement('div')
    this._context.classList.add('text-editor')
  }

  init (): void {
    this._representation.addNewLines(new Range(0, 1))
    this._textCursor.y = 0
    this.updateTextRepresentation()
    this.updateTextCursorPosition()
  }

  getContext (): HTMLElement {
    return this._context
  }

  addText (point: Point, text: string): void {
    this._representation.addTextInLine(point, text)
  }

  addContent (point: Point, content: INodeCopy[]): void {
    this._representation.addContent(point, content)
  }

  addTextStyleInSelections (selections: Selection[], textStyleType: TextStyle): void {
    this._representation.addTextStylesInSelections(selections, textStyleType)
  }

  addTextCursorSelections (selections: Selection[]): void {
    this._textCursor.addSelections(selections)
  }

  addNewLinesInRange (rangeY: Range): void {
    this._representation.addNewLines(rangeY)
  }

  changeTextCursorSelection (selectionIndex: number, selection: Selection): void {
    this._textCursor.changeSelection(selectionIndex, selection)
  }

  deleteTextInRange (y: number, rangeX: Range): void {
    this._representation.deleteTextInLine(y, rangeX)
  }

  deleteTextInSelections (selections: Selection[]): void {
    this._representation.deleteTextInSelections(selections)
  }

  deleteConcreteTextStylesInSelections (selections: Selection[], textStyleType: TextStyle): void {
    this._representation.deleteConcreteTextStyleInSelections(selections, textStyleType)
  }

  deleteAllTextStylesInSelections (selections: Selection[]): void {
    this._representation.deleteAllTextStylesInSelections(selections)
  }

  deleteLinesInRange (rangeY: Range): void {
    this._representation.deleteLines(rangeY)
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

  setTextCursorPosition (position: Point): void {
    this._textCursor.position = position
  }

  subscribeForTextCursorPosition (subscriber: ITextCursorPositionSubscriber): void {
    this._textCursor.subscribeForPosition(subscriber)
  }

  subscribeForTextCursorSelections (subscriber: ITextCursorSelectionsSubscriber): void {
    this._textCursor.subscribeForSelections(subscriber)
  }

  subscribeForTextRepresentation (subscriber: ITextRepresentationSubscriber): void {
    this._representation.subscribe(subscriber)
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
    this._representation.notifySubscribers()
  }

  updateActiveStyles (): void {
    const activeTextStyles: TextStyle[] = this._representation.getTextStylesInSelections(this._textCursor.selections)
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

  getTextCursorPosition (): Point {
    return this._textCursor.position
  }

  getLineLength (lineY: number): number {
    return this._representation.getTextLengthInLine(lineY)
  }

  getLinesCount (): number {
    return this._representation.getLinesCount()
  }

  getTextCursorSelections (): Selection[] {
    return this._textCursor.selections
  }

  getContentInSelections (selections: Selection[]): INodeCopy[] {
    return this._representation.getContentInSelections(selections)
  }
}

export { TextEditor }
