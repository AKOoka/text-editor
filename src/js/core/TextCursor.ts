import { ITextCursor } from './ITextCursor'
import { ITextCursorSubscriber } from '../common/ITextCursorSubscriber'
import { IRange } from '../common/IRange'

class TextCursor implements ITextCursor {
  private _horizontalPosition: number
  private _verticalPosition: number
  private _selections: IRange[]
  private readonly _subscribers: ITextCursorSubscriber[]

  constructor () {
    this._horizontalPosition = 0
    this._verticalPosition = 0
    this._selections = []
    this._subscribers = []
  }

  getHorizontalPosition (): number {
    return this._horizontalPosition
  }

  setHorizontalPosition (position: number): void {
    this._horizontalPosition = position
    console.log(`h: ${this._horizontalPosition}`)
  }

  getVerticalPosition (): number {
    return this._verticalPosition
  }

  setVerticalPosition (position: number): void {
    this._verticalPosition = position
    console.log(`v: ${this._verticalPosition}`)
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

  updateSubscribers (): void {
    for (const sub of this._subscribers) {
      sub.updateTextCursorPosition(this._horizontalPosition, this._verticalPosition, this._selections)
    }
  }

  subscribe (subscriber: ITextCursorSubscriber): void {
    this._subscribers.push(subscriber)
  }
}

export { TextCursor }
