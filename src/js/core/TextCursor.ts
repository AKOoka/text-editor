import { ITextCursor } from './ITextCursor'
import { ITextCursorSubscriber } from '../common/ITextCursorSubscriber'
import { IRange } from '../common/IRange'

class TextCursor implements ITextCursor {
  private _position: number
  private _linePosition: number
  private _selections: IRange[]
  private readonly _subscribers: ITextCursorSubscriber[]

  constructor () {
    this._position = 0
    this._linePosition = 0
    this._selections = []
    this._subscribers = []
  }

  getPosition (): number {
    return this._position
  }

  getLinePosition (): number {
    return this._linePosition
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

  setPos (position: number, linePosition: number): void {
    this._position = position
    this._linePosition = linePosition
  }

  updateSubscribers (): void {
    for (const sub of this._subscribers) {
      sub.updateTextCursorPosition(this._position, this._linePosition, this._selections)
    }
  }

  subscribe (subscriber: ITextCursorSubscriber): void {
    this._subscribers.push(subscriber)
  }
}

export { TextCursor }
