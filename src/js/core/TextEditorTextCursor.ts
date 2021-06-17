import { ITextCursorPositionSubscriber } from '../common/ITextCursorPositionSubscriber'
import { ITextCursorSelectionsSubscriber } from '../common/ITextCursorSelectionsSubscriber'
import { Selection } from '../common/Selection'
import { Point } from '../common/Point'

class TextEditorTextCursor {
  private _position: Point
  private _selections: Selection[]
  private readonly _positionSubscribers: ITextCursorPositionSubscriber[]
  private readonly _selectionsSubscribers: ITextCursorSelectionsSubscriber[]

  constructor () {
    this._position = new Point(0, 0)
    this._selections = []
    this._positionSubscribers = []
    this._selectionsSubscribers = []
  }

  get x (): number {
    return this._position.x
  }

  set x (x: number) {
    this._position.x = x
    // console.log(`x: ${this._position.x}, y: ${this._position.y}`)
  }

  get y (): number {
    return this._position.y
  }

  set y (y: number) {
    this._position.y = y
    // console.log(`x: ${this._position.x}, y: ${this._position.y}`)
  }

  get position (): Point {
    return this._position.copy()
  }

  set position (position: Point) {
    this._position = position
    // console.log(`x: ${this._position.x}, y: ${this._position.y}`)
  }

  get selections (): Selection[] {
    return this._selections
  }

  addSelections (selections: Selection[]): void {
    this._selections.push(...selections)
  }

  changeSelection (selectionIndex: number, selection: Selection): void {
    this._selections[selectionIndex] = selection
  }

  deleteConcreteSelection (selectionIndex: number): void {
    this._selections.splice(selectionIndex, 1)
  }

  deleteAllSelections (): void {
    this._selections = []
  }

  notifyPositionSubscribers (): void {
    for (const subscriber of this._positionSubscribers) {
      subscriber.updateTextCursorPosition(this._position.copy())
    }
  }

  notifySelectionsSubscribers (): void {
    for (const subscriber of this._selectionsSubscribers) {
      subscriber.updateTextCursorSelections(this._selections)
    }
  }

  subscribeForPosition (subscriber: ITextCursorPositionSubscriber): void {
    this._positionSubscribers.push(subscriber)
  }

  subscribeForSelections (subscriber: ITextCursorSelectionsSubscriber): void {
    this._selectionsSubscribers.push(subscriber)
  }
}

export { TextEditorTextCursor }
