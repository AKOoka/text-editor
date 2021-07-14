import { Point } from '../common/Point'
import { Range } from '../common/Range'

export class TextAreaLayerTextContext {
  private readonly _contextHtml: HTMLElement
  private readonly _lines: HTMLElement[][]
  private _lineBoundaries: Range

  constructor () {
    this._contextHtml = document.createElement('pre')
    this._contextHtml.classList.add('text-area_layer-text')
    this._lines = []
  }

  get contextHtml (): HTMLElement {
    return this._contextHtml
  }

  get lineBoundaries (): Range {
    return this._lineBoundaries
  }

  get lines (): HTMLElement[][] {
    return this._lines
  }

  getLinesCount (): number {
    return this._lines.length
  }

  getLinePartsCount (y: number): number {
    return this._lines[y].length
  }

  getLinePartAll (y: number): HTMLElement[] {
    return this._lines[y]
  }

  getLinePartConcrete (y: number, partY: number): HTMLElement {
    return this._lines[y][partY]
  }

  getLinePartY (point: Point): { linePartY: number, linePartOffsetX: number } {
    const { x, y } = point
    let partOffsetX: number = 0

    for (let i = 0; i < this._lines[y].length; i++) {
      if (x >= partOffsetX && x <= partOffsetX + this._lines[y][i].innerText.length) {
        return { linePartY: i, linePartOffsetX: partOffsetX }
      }
      partOffsetX += this._lines[y][i].innerText.length
    }

    return {
      linePartY: this._lines[y].length - 1,
      linePartOffsetX: partOffsetX - this._lines[y][this._lines[y].length - 1].innerText.length
    }

    // const linePartsLength = this._lines[y].map(v => v.innerText.length)
    // const lineLength = linePartsLength.reduce((p, c) => p + c)
    // console.log('error lod\npoint:', point, 'lineLength:', lineLength, 'line parts length:', linePartsLength)
    // throw new Error("can't get line part")
  }

  getLineWidth (y: number): number {
    return this._lines[y].reduce((p, c) => p + c.innerText.length, 0)
  }

  getLinePartWidth (y: number, partY: number): number {
    return this._lines[y][partY].innerText.length
  }

  getLineWidthOnRangePartY (y: number, rangePartY: Range): number {
    let width: number = 0

    for (let i = rangePartY.start; i < rangePartY.end; i++) {
      width += this._lines[y][i].innerText.length
    }

    return width
  }

  getPointAdjacentByDisplayY (point: Point, offsetY: number): Point {
    const { linePartY, linePartOffsetX } = this.getLinePartY(point)
    const { x, y } = point
    let newX: number = 0
    let newY: number = 0
    const offsetX: number = x - linePartOffsetX

    if (offsetY < 0) {
      if (linePartY + offsetY >= 0) {
        newY = y
        newX = linePartOffsetX - this.getLineWidthOnRangePartY(y, new Range(linePartY + offsetY, linePartY)) + offsetX
      } else if (y + offsetY > 0) {
        newY = y + offsetY
        newX = this.getLineWidth(newY) - offsetX
      } else {
        newY = 0
        newX = x
      }
    } else {
      if (linePartY + offsetY < this._lines[y].length) {
        newY = y
        newX = linePartOffsetX + this.getLineWidthOnRangePartY(y, new Range(linePartY, linePartY + offsetY)) + offsetX
      } else if (y + offsetY < this.lines.length) {
        newY = y + offsetY
        newX = offsetX
      } else {
        newY = this.lines.length - 1
        newX = x
      }
    }

    return point.copy().reset(newX, newY)
  }

  init (lineWidth: Range): void {
    this._lineBoundaries = lineWidth
  }

  addLine (y: number, lineParts: HTMLElement[]): void {
    let insertBefore: HTMLElement | null = null
    if (this._lines[y] !== undefined) {
      insertBefore = this._lines[y][0]
    }
    for (const part of lineParts) {
      this._contextHtml.insertBefore(part, insertBefore)
    }
    this._lines.splice(y, 0, lineParts)
  }

  addNodeToLinePartEnd (y: number, linePartY: number, node: HTMLElement): void {
    this._lines[y][linePartY].append(node)
  }

  changeLine (y: number, lineParts: HTMLElement[]): void {
    const lineSizeDifference: number = lineParts.length - this._lines[y].length
    const replaceUntil = lineParts.length > this._lines[y].length ? this._lines[y].length : lineParts.length
    let i: number = 0

    for (i; i < replaceUntil; i++) {
      this._lines[y][i].replaceWith(lineParts[i])
    }

    if (lineSizeDifference > 0) {
      this._contextHtml.insertBefore(
        lineParts[i],
        this._lines[y + 1] !== undefined ? this._lines[y + 1][0] : null
      )
      for (++i; i < lineParts.length; i++) {
        this._contextHtml.insertBefore(lineParts[i], lineParts[i - 1])
      }
    } else {
      for (i; i < this._lines[y].length; i++) {
        this._lines[y][i].remove()
      }
    }

    this._lines[y] = lineParts
  }

  deleteLine (y: number): void {
    for (const linePart of this._lines[y]) {
      linePart.remove()
    }
    this._lines.splice(y, 1)
  }
}
