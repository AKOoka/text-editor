class Range {
  private _start: number
  private _end: number
  private _width: number

  constructor (start: number, end: number) {
    this.reset(start, end)
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

  copy (): Range {
    return new Range(this._start, this._end)
  }

  reset (start: number, end: number): Range {
    this._start = start
    this._end = end
    this._width = end - start
    return this
  }

  translate (offset: number): Range {
    this._start += offset
    this._end += offset
    return this
  }
}

export { Range }
