import { ITextCursorPositionSubscriber } from '../common/ITextCursorPositionSubscriber'
import { ITextCursorSelectionsSubscriber } from '../common/ITextCursorSelectionsSubscriber'
import { Selection } from '../common/Selection'
import { Point } from '../common/Point'

class TextEditorTextCursor {
  private _point: Point
  private _selections: Selection[]
  private readonly _positionSubscribers: ITextCursorPositionSubscriber[]
  private readonly _selectionsSubscribers: ITextCursorSelectionsSubscriber[]

  constructor () {
    this._point = new Point(0, 0)
    this._selections = []
    this._positionSubscribers = []
    this._selectionsSubscribers = []
  }

  get x (): number {
    return this._point.x
  }

  set x (x: number) {
    this._point.x = x
    console.log(`text cursor { x: ${this._point.x}, y: ${this._point.y} }`)
  }

  get y (): number {
    return this._point.y
  }

  set y (y: number) {
    this._point.y = y
    console.log(`text cursor { x: ${this._point.x}, y: ${this._point.y} }`)
  }

  get point (): Point {
    return this._point.copy()
  }

  set point (point: Point) {
    this._point.reset(point.x, point.y)
    console.log(`text cursor { x: ${this._point.x}, y: ${this._point.y} }`)
  }

  get selections (): Selection[] {
    return this._selections
  }

  addSelections (selections: Selection[]): void {
    this._selections.push(...selections)
    console.log('text cursor selections', ...this._selections)
  }

  changeSelection (selectionIndex: number, selection: Selection): void {
    this._selections[selectionIndex] = selection
    console.log('text cursor selections', ...this._selections)
  }

  deleteConcreteSelection (selectionIndex: number): void {
    this._selections.splice(selectionIndex, 1)
    console.log('text cursor selections', ...this._selections)
  }

  deleteAllSelections (): void {
    this._selections = []
    console.log('text cursor selections', ...this._selections)
  }

  notifyPositionSubscribers (): void {
    for (const subscriber of this._positionSubscribers) {
      subscriber.updateTextCursorPosition(this._point.copy())
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
