import { ITextCursorPositionSubscriber } from '../common/ITextCursorPositionSubscriber'
import { ITextCursorSelectionsSubscriber } from '../common/ITextCursorSelectionsSubscriber'
import { Selection } from '../common/Selection'
import { Point } from '../common/Point'

class TextEditorTextCursor {
  private _point: Point
  private _selections: Selection[]
  private _savedX: number
  private _isLastUpdateY: boolean
  private readonly _positionSubscribers: ITextCursorPositionSubscriber[]
  private readonly _selectionsSubscribers: ITextCursorSelectionsSubscriber[]

  constructor () {
    this._point = new Point(0, 0)
    this._selections = []
    this._savedX = 0
    this._isLastUpdateY = false
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

  get savedX (): number {
    return this._savedX
  }

  get y (): number {
    return this._point.y
  }

  set y (y: number) {
    this._point.y = y
    console.log(`text cursor { x: ${this._point.x}, y: ${this._point.y} }`)
  }

  get isLastUpdateY (): boolean {
    return this._isLastUpdateY
  }

  set isLastUpdateY (state: boolean) {
    this._isLastUpdateY = state
  }

  get point (): Point {
    return this._point.copy()
  }

  set point (position: Point) {
    this._point = position
    console.log(`text cursor { x: ${this._point.x}, y: ${this._point.y} }`)
  }

  get selections (): Selection[] {
    return this._selections
  }

  saveX (): void {
    this._savedX = this._point.x
    console.log(`xSaved: ${this._savedX}`)
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
