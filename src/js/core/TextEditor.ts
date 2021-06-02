import { ITextEditor } from './ITextEditor'
import { Range } from '../common/Range'
import { TextStyleType } from '../common/TextStyleType'
import { TextEditorTextCursor } from './TextEditorTextCursor'
import { TextEditorRepresentation } from './TextRepresentation/TextEditorRepresentation'
import { ITextCursorPositionSubscriber } from '../common/ITextCursorPositionSubscriber'
import { ITextCursorSelectionsSubscriber } from '../common/ITextCursorSelectionsSubscriber'
import { ITextRepresentationSubscriber } from '../common/ITextRepresentationSubscriber'
import { IActiveTextStylesSubscriber } from '../common/IActiveTextStylesSubscriber'
import { NodeRepresentation } from './TextRepresentation/NodeRepresentation'
import { IPoint } from '../common/IPoint'
import { ISelection } from '../common/ISelection'

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

  addText (point: IPoint, text: string): void {
    this._representation.addTextInLine(point, text)
  }

  addContent (point: IPoint, content: NodeRepresentation[]): void {
    this._representation.addContent(point, content)
  }

  addTextStyleInSelections (selections: ISelection[], textStyleType: TextStyleType): void {
    this._representation.addTextStylesInSelections(selections, textStyleType)
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
    this._representation.addNewLines(rangeY)
  }

  deleteTextInRange (y: number, rangeX: Range): void {
    this._representation.deleteTextInLine(y, rangeX)
  }

  deleteTextInSelections (selections: ISelection[]): void {
    this._representation.deleteTextInSelections(selections)
  }

  deleteConcreteTextStylesInSelections (selections: ISelection[], textStyleType: TextStyleType): void {
    this._representation.deleteConcreteTextStyleInSelections(selections, textStyleType)
  }

  deleteAllTextStylesInSelections (selections: ISelection[]): void {
    this._representation.deleteAllTextStylesInSelections(selections)
  }

  deleteLinesInRange (rangeY: Range): void {
    this._representation.deleteLines(rangeY)
  }

  deleteTextCursorSelections (): void {
    this._textCursor.deleteSelections()
  }

  setTextCursorX (x: number): void {
    this._textCursor.x = x
  }

  setTextCursorY (y: number): void {
    this._textCursor.y = y
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
    const activeTextStyles: TextStyleType[] = this._representation.getTextStylesInSelections(this._textCursor.selections)
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

  getTextCursorPosition (): IPoint {
    return this._textCursor.position
  }

  getLineLength (lineY: number): number {
    return this._representation.getTextLengthInLine(lineY)
  }

  getLinesCount (): number {
    return this._representation.getLinesCount()
  }

  getTextCursorSelections (): ISelection[] {
    return this._textCursor.selections
  }

  getContentInSelections (selections: ISelection[]): NodeRepresentation[] {
    return this._representation.getContentInSelections(selections)
  }
}

export { TextEditor }
