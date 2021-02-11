import { ITextStyle } from './ITextStyle'

class TextStyle implements ITextStyle {
  private readonly _start: number
  private readonly _end: number
  private readonly _type: string

  constructor (start: number, end: number, type: string) {
    this._start = start
    this._end = end
    this._type = type
  }

  getStartPos (): number {
    return this._start
  }

  getEndPos (): number {
    return this._end
  }

  getType (): string {
    return this._type
  }
}

export { TextStyle }
