class TextStyle {
  private readonly _type: string
  startOffset: number
  endOffset: number

  get type (): string {
    return this._type
  }

  constructor (type: string, startOffset: number = 0, endOffset: number = 0) {
    this._type = type
    this.startOffset = startOffset
    this.endOffset = endOffset
  }
}

export { TextStyle }
