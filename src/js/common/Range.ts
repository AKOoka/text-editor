export class Range {
  protected _start: number
  protected _end: number
  protected _width: number

  get start (): number {
    return this._start
  }

  set start (value: number) {
    this._start = value
  }

  get end (): number {
    return this._end
  }

  set end (value: number) {
    this._end = value
  }

  get width (): number {
    return this._width
  }

  set width (value: number) {
    this._width = value
  }

  constructor (start: number, end: number) {
    this._start = start
    this._end = end
    this._width = end - start
  }

  translate (offset: number): Range {
    this._start += offset
    this._end += offset
    return this
  }

  copy (start: number = this._start, end: number = this._end): Range {
    return new Range(start, end)
  }

  reset (start: number, end: number, ..._: unknown[]): Range {
    this._start = start
    this._end = end
    this._width = end - start
    return this
  }

  setStart (start: number): Range {
    this._start = start
    this._width = this._end - start
    return this
  }

  setEnd (end: number): Range {
    this._end = end
    this._width = end - this._start
    return this
  }

  isOnPosition (position: number): boolean {
    return this._start <= position && this._end >= position
  }

  isRangeIntersects (range: Range): boolean {
    return (this._start >= range.start && this._start <= range.end) ||
           (this._end >= range.start && this._end <= range.end)
  }

  isInsideRange (range: Range): boolean {
    return this._start >= range.start && this._end <= range.end
  }

  isRangeInside (range: Range): boolean {
    return this._start <= range.start && this._end >= range.end
  }

  isStartInRange (range: Range): boolean {
    return this._start >= range.start && this._start <= range.end
  }

  isEndInRange (range: Range): boolean {
    return this._end >= range.start && this._end <= range.end
  }
}
