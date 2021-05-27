class Range {
  private _start: number
  private _end: number
  private _width: number

  constructor (start: number, end: number) {
    this._start = start
    this._end = end
    this._width = end - start
  }

  get start (): number {
    return this._start
  }

  get end (): number {
    return this._end
  }

  get width (): number {
    return this._width
  }

  reset (start: number, end: number): void {
    this._start = start
    this._end = end
    this._width = end - start
  }
}

export { Range }
