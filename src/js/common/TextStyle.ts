type CompareFunction = (textStyle: TextStyle) => boolean

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

  deepCompare (textStyle: TextStyle): boolean {
    return textStyle.property === this._property && textStyle.value === this._value
  }

  private _inside (textStyles: IterableIterator<TextStyle>, compareFunction: CompareFunction): boolean {
    for (const t of textStyles) {
      if (compareFunction(t)) {
        return true
      }
    }
    return false
  }

  compareInside (textStyles: IterableIterator<TextStyle>): boolean {
    return this._inside(textStyles, this.compare.bind(this))
  }

  deepCompareInside (textStyles: IterableIterator<TextStyle>): boolean {
    return this._inside(textStyles, this.deepCompare.bind(this))
  }
}
