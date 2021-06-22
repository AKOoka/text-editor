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

    for (let i = 0; i < this._lines[y].length - 1; i++) {
      if (x >= partOffsetX && x <= partOffsetX + this._lines[y][i].innerText.length) {
        return { linePartY: i, linePartOffsetX: partOffsetX }
      }
      partOffsetX += this._lines[y][i].innerText.length
    }

    throw new Error("can't get line part")
  }

  getLineWidth (y: number): number {
    return this._lines[y].reduce((p, c) => p + c.innerText.length, 0)
  }

  getLinePartWidth (y: number, partY: number): number {
    return this._lines[y][partY].innerText.length
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
    const oldLine = this._lines[y]
    const lineSizeDifference: number = lineParts.length - oldLine.length
    const replaceUntil = lineParts.length - Math.abs(lineSizeDifference)

    this._lines[y] = lineParts

    let i: number = 0
    for (i; i < replaceUntil; i++) {
      oldLine[i].replaceWith(lineParts[i])
    }

    if (lineSizeDifference > 0) {
      this._contextHtml.insertBefore(lineParts[i], this._lines[y + 1][0])
      i++
      for (i; i < lineParts.length; i++) {
        this._contextHtml.insertBefore(lineParts[i], lineParts[i - 1])
      }
    } else {
      for (i; i < oldLine.length; i++) {
        oldLine[i].remove()
      }
    }
  }

  deleteLine (y: number): void {
    for (const linePart of this._lines[y]) {
      linePart.remove()
    }
    this._lines.splice(y, 1)
  }
}
