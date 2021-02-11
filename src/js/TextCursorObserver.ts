import { TextCursorType } from './TextCursorType'
import { ITextCursor } from './ITextCursor'
import { TextCursor } from './TextCursor'
import { ITextCursorSubscriber } from './ITextCursorSubscriber'
import { ITextStyle } from './ITextStyle'

class TextCursorObserver implements ITextCursor {
  private readonly _wrappee: ITextCursor
  private readonly _posSubscribers: ITextCursorSubscriber[]

  constructor (textCursor: ITextCursor = new TextCursor()) {
    this._wrappee = textCursor
    this._posSubscribers = []
  }

  getType (): TextCursorType {
    return this._wrappee.getType()
  }

  getStart (): number {
    return this._wrappee.getStart()
  }

  getEnd (): number {
    return this._wrappee.getEnd()
  }

  getLinePosition (): number {
    return this._wrappee.getLinePosition()
  }

  getTextStyles (): ITextStyle[] {
    return this._wrappee.getTextStyles()
  }

  setPos (start: number, end: number, linePosition: number, textStyles: ITextStyle[]): void {
    this._wrappee.setPos(start, end, linePosition, textStyles)

    for (const sub of this._posSubscribers) {
      sub.updateTextCursorStatus(start, end, linePosition, this._wrappee.getType(), textStyles)
    }
  }

  subscribe (subscriber: ITextCursorSubscriber): void {
    this._posSubscribers.push(subscriber)
  }
}

export { TextCursorObserver }
