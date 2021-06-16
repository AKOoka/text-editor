export class TextStyle {
  private readonly _property: string
  private readonly _value: string

  constructor (property: string, value: string) {
    this._property = property
    this._value = value
  }

  get property (): string {
    return this._property
  }

  get value (): string {
    return this._value
  }

  compare (textStyle: TextStyle): boolean {
    return textStyle.property === this._property
  }

  inside (textStyles: IterableIterator<TextStyle>): boolean {
    for (const t of textStyles) {
      if (this.compare(t)) {
        return true
      }
    }
    return false
  }
}
