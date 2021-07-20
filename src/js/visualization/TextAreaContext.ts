import { Point } from '../common/Point'
import { Range } from '../common/Range'
import { NodeRepresentation } from '../core/TextRepresentation/Nodes/NodeRepresentation'
import { HtmlCreator } from './HtmlCreator'

export class TextAreaContext {
  protected readonly _contextHtml: HTMLElement
  protected readonly _htmlCreator: HtmlCreator
  protected readonly _lines: HTMLElement[][]
  protected _lineBoundaries: Range

  constructor () {
    this._contextHtml = this._createContextHtml()
    this._htmlCreator = new HtmlCreator()
    this._lines = []
  }

  private _createContextHtml (): HTMLElement {
    const htmlContext: HTMLElement = document.createElement('pre')

    htmlContext.classList.add('layer-text')

    return htmlContext
  }

  init (): void {
    this._lineBoundaries = new Range(0, this._contextHtml.offsetWidth)
  }

  getContextHtml (): HTMLElement {
    return this._contextHtml
  }

  getLineBoundaries (): Range {
    return this._lineBoundaries
  }

  getLines (): HTMLElement[][] {
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

  getLinePartYByDisplayY (lineY: number, displayY: number): number {
    let offset: number = this._lines[lineY][0].offsetTop

    for (let i = 0; i < this._lines[lineY].length; i++) {
      if (displayY >= offset && displayY <= offset + this._lines[lineY][i].offsetHeight) {
        return i
      } else {
        offset += this._lines[lineY][i].offsetHeight
      }
    }

    throw Error("can't find partY by displayY")
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

  createHtmlElement (tag: keyof HTMLElementTagNameMap): HTMLElement {
    return this._htmlCreator.createHtmlElement(tag)
  }

  createHtmlFromNodeRepresentation (lineRepresentation: NodeRepresentation): HTMLElement {
    return this._htmlCreator.createHtmlFromNodeRepresentation(lineRepresentation)
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
