import { ITextCursorPositionSubscriber } from '../common/ITextCursorPositionSubscriber'
import { IRange } from '../common/IRange'
import { ITextCursorSelectionsSubscriber } from '../common/ITextCursorSelectionsSubscriber'

class TextCursor {
  private _x: number
  private _y: number
  private _selections: IRange[]
  private readonly _positionSubscribers: ITextCursorPositionSubscriber[]
  private readonly _selectionsSubscribers: ITextCursorSelectionsSubscriber[]

  constructor () {
    this._x = 0
    this._y = 0
    this._selections = []
    this._positionSubscribers = []
    this._selectionsSubscribers = []
  }

  getX (): number {
    return this._x
  }

  getY (): number {
    return this._y
  }

  setX (position: number): void {
    this._x = position
    console.log(`h: ${this._x}`)
  }

  setY (position: number): void {
    this._y = position
    console.log(`v: ${this._y}`)
  }

  getSelections (): IRange[] {
    return this._selections
  }

  addSelection (selection: IRange): void {
    this._selections.push(selection)
  }

  clearSelections (): void {
    this._selections = []
  }

  notifyPositionSubscribers (): void {
    for (const subscriber of this._positionSubscribers) {
      subscriber.updateTextCursorPosition(this._x, this._y, this._selections)
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

export { TextCursor }
