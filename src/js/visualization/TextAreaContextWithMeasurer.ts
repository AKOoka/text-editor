import { Point } from '../common/Point'
import { Range } from '../common/Range'
import { ILineWithStylesContent } from '../core/TextRepresentation/LineWithStyles/LineWithStylesContent'
import { IElementSplit } from './ElementSplitsManager'
import { IHtmlMeasurer } from './IHtmlMeasurer'
import { ITextAreaRangeX, MeasureHtmlTool } from './MeasureHtmlTool'
import { TextAreaContext } from './TextAreaContext'

export class TextAreaContextWithMeasurer extends TextAreaContext implements IHtmlMeasurer {
  private readonly _measureHtmlTool: MeasureHtmlTool

  constructor () {
    super()
    this._measureHtmlTool = new MeasureHtmlTool()
  }

  init (): void {
    super.init()
    this._measureHtmlTool.setContext(this._htmlContext)
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

  getLinePartOffsetX (y: number, linePartY: number): number {
    let offset: number = 0

    for (let i = 0; i < linePartY; i++) {
      offset += this._lines[y][i].innerText.length
    }

    return offset
  }

  measureLinePartDisplayHeight (y: number, partY: number): number {
    return this._measureHtmlTool.computeLinePartDisplayHeight(this._lines[y][partY])
  }

  normalizeDisplayPoint (displayPoint: Point): Point {
    return this._measureHtmlTool.normalizeDisplayPoint(displayPoint)
  }

  convertDisplayPointToPoint (displayPoint: Point): Point {
    const { y, partY } = this._measureHtmlTool.convertDisplayYToY(this._lines, displayPoint.y)
    return displayPoint.copy().reset(
      this._measureHtmlTool.convertDisplayXToX(this._lines[y][partY], displayPoint.x) + this.getLinePartOffsetX(y, partY),
      y
    )
  }

  convertPointToDisplayPoint (point: Point): { displayPoint: Point, linePartY: number, linePartOffsetX: number } {
    const { linePartY, linePartOffsetX } = this.getLinePartY(point)
    return {
      displayPoint: point.copy().reset(
        this._measureHtmlTool.convertXToDisplayX(this._lines[point.y][linePartY], point.x - linePartOffsetX),
        this._measureHtmlTool.convertYToDisplayY(this._lines, point.y, linePartY)
      ),
      linePartY,
      linePartOffsetX
    }
  }

  convertRangeXToDisplayRangeX (rangeY: number, rangeX: Range): ITextAreaRangeX {
    return this._measureHtmlTool.convertRangeXToDisplayRangeX(this._lines[rangeY], rangeX)
  }

  translatePoint (point: Point, offsetY: number): Point {
    const { linePartY, linePartOffsetX } = this.getLinePartY(point)
    const { x, y } = point
    let newX: number = 0
    let newY: number = 0
    const offsetX: number = x - linePartOffsetX

    if (offsetY < 0) {
      if (linePartY + offsetY >= 0) {
        newY = y
        newX = this.getLineWidthOnRangePartY(y, new Range(0, linePartY - 1)) + offsetX
      } else if (y + offsetY >= 0) {
        newY = y + offsetY
        if (offsetX < this.getLinePartWidth(newY, this._lines[newY].length - 1)) {
          newX = this.getLineWidthOnRangePartY(newY, new Range(0, this._lines[newY].length - 1)) + offsetX
        } else {
          newX = this.getLineWidth(newY)
        }
      } else {
        newY = 0
        newX = x
      }
    } else {
      if (linePartY + offsetY < this._lines[y].length) {
        newY = y
        newX = this.getLineWidthOnRangePartY(y, new Range(0, linePartY + offsetY)) + offsetX
      } else if (y + offsetY < this._lines.length) {
        newY = y + offsetY
        if (offsetX < this.getLinePartWidth(newY, 0)) {
          newX = offsetX
        } else {
          newX = this.getLinePartWidth(newY, 0)
        }
      } else {
        newY = this._lines.length - 1
        newX = x
      }
    }

    return point.copy().reset(newX, newY)
  }

  computeLineDisplayHeightOnPoint (linePoint: Point): number {
    const { linePartY } = this.getLinePartY(linePoint)
    return this._measureHtmlTool.computeLinePartDisplayHeight(this._lines[linePoint.y][linePartY])
  }

  computeLinePartDisplayHeight (y: number, partY: number): number {
    return this._measureHtmlTool.computeLinePartDisplayHeight(this._lines[y][partY])
  }

  computeLinePartDisplayY (y: number, partY: number): number {
    return this._measureHtmlTool.convertYToDisplayY(this._lines, y, partY)
  }

  splitElementByDisplayWidth (line: HTMLElement): IElementSplit[] {
    return this._measureHtmlTool.splitElementByDisplayWidth(line, this._lineBoundaries.width)
  }

  splitByDisplayWidthLineWithStyles (line: ILineWithStylesContent): number[] {
    return this._measureHtmlTool.splitByDisplayWidthLineWithStyles(line, this._lineBoundaries.width)
  }
}
