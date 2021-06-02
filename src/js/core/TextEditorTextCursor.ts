import { ITextCursorPositionSubscriber } from '../common/ITextCursorPositionSubscriber'
import { ITextCursorSelectionsSubscriber } from '../common/ITextCursorSelectionsSubscriber'
import { ISelection } from '../common/ISelection'
import { IPoint } from '../common/IPoint'

class TextEditorTextCursor {
  private _position: IPoint
  private _selections: ISelection[]
  private readonly _positionSubscribers: ITextCursorPositionSubscriber[]
  private readonly _selectionsSubscribers: ITextCursorSelectionsSubscriber[]

  constructor () {
    this._position = { x: 0, y: 0 }
    this._selections = []
    this._positionSubscribers = []
    this._selectionsSubscribers = []
  }

  get x (): number {
    return this._position.x
  }

  set x (x: number) {
    this._position.x = x
    console.log(`x: ${this._position.x}, y: ${this._position.y}`)
  }

  get y (): number {
    return this._position.y
  }

  set y (y: number) {
    this._position.y = y
    console.log(`x: ${this._position.x}, y: ${this._position.y}`)
  }

  get position (): IPoint {
    return { x: this._position.x, y: this._position.y }
  }

  set position (position: IPoint) {
    this._position = position
    console.log(`x: ${this._position.x}, y: ${this._position.y}`)
  }

  get selections (): ISelection[] {
    return this._selections
  }

  addSelections (selections: ISelection[]): void {
    this._selections.push(...selections)
  }

  deleteSelections (): void {
    this._selections = []
  }

  notifyPositionSubscribers (): void {
    for (const subscriber of this._positionSubscribers) {
      subscriber.updateTextCursorPosition({ x: this._position.x, y: this._position.y })
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
