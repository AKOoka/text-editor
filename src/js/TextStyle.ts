class TextStyle {
  private readonly _type: string
  private readonly _offset: number

  get type (): string {
    return this._type
  }

  get offset (): number {
    return this._offset
  }

  constructor (type: string, offset: number) {
    this._type = type
    this._offset = offset
  }
}

export { TextStyle }
