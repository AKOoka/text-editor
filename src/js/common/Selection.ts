import { Range } from './Range'
import { IPoint } from './IPoint'

export class Selection {
  private readonly _rangeX: Range
  private readonly _rangeY: Range

  constructor (rangeX: Range, rangeY: Range) {
    this._rangeX = rangeX
    this._rangeY = rangeY
  }

  get rangeX (): Range {
    return this._rangeX
  }

  get rangeY (): Range {
    return this._rangeY
  }

  get startX (): number {
    return this._rangeX.start
  }

  get startY (): number {
    return this._rangeY.start
  }

  get endX (): number {
    return this._rangeX.end
  }

  get endY (): number {
    return this._rangeY.end
  }

  getStartPoint (): IPoint {
    return {
      x: this._rangeX.start,
      y: this._rangeY.start
    }
  }

  getEndPoint (): IPoint {
    return {
      x: this._rangeX.end,
      y: this._rangeY.end
    }
  }

  reset (startX: number, startY: number, endX: number, endY: number): Selection {
    this._rangeX.reset(startX, endX)
    this._rangeY.reset(startY, endY)
    return this
  }

  resetStart (startPoint: IPoint): Selection {
    this._rangeX.reset(startPoint.x, this._rangeX.end)
    this._rangeY.reset(startPoint.y, this._rangeY.end)
    return this
  }

  resetEnd (endPoint: IPoint): Selection {
    this._rangeX.reset(this._rangeX.start, endPoint.x)
    this._rangeY.reset(this._rangeY.start, endPoint.y)
    return this
  }
}
