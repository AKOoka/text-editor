export class Point {
  private _x: number
  private _y: number

  constructor (x: number, y: number) {
    this.reset(x, y)
  }

  get x (): number {
    return this._x
  }

  set x (x: number) {
    this._x = x
  }

  get y (): number {
    return this._y
  }

  set y (y: number) {
    this._y = y
  }

  reset (x: number, y: number): Point {
    this._x = x
    this._y = y
    return this
  }

  copy (): Point {
    return new Point(this._x, this._y)
  }

  translate (offsetX: number, offsetY: number): this {
    this._x += offsetX
    this._y += offsetY
    return this
  }
}
