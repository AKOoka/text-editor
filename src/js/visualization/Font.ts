export class Font {
  private _family: string
  private _size: string
  private _merged: string

  get family (): string {
    return this._family
  }

  set family (value: string) {
    this._family = value
    this._updateMergedFont()
  }

  get size (): string {
    return this._size
  }

  set size (value: string) {
    this._size = value
    this._updateMergedFont()
  }

  get merged (): string {
    return this._merged
  }

  constructor (family: string, size: string) {
    this._family = family
    this._size = size
    this._merged = `${this._family} ${this._size}`
  }

  private _updateMergedFont (): void {
    this._merged = `${this._family} ${this._size}`
  }

  copy (): Font {
    return new Font(this._family, this._size)
  }
}
