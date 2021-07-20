import { Point } from '../common/Point'
import { Range } from '../common/Range'
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
    this._measureHtmlTool.setContext(this._contextHtml)
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
      this._measureHtmlTool.convertDisplayXToX(this._lines[y][partY], displayPoint.x),
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
        newX = linePartY + offsetY === 0 ? offsetX : this.getLineWidthOnRangePartY(y, new Range(linePartY + offsetY - 1, linePartY - 1)) + offsetX
      } else if (y + offsetY >= 0) {
        newY = y + offsetY
        if (offsetX < this.getLinePartWidth(newY, this._lines[newY].length - 1)) {
          newX = this._lines[newY].length > 1 ? this.getLineWidthOnRangePartY(newY, new Range(0, this._lines[newY].length - 1)) + offsetX : offsetX
        } else {
          newX = this.getLineWidth(newX)
        }
      } else {
        newY = 0
        newX = x
      }
    } else {
      if (linePartY + offsetY < this._lines[y].length) {
        newY = y
        newX = this.getLineWidthOnRangePartY(y, new Range(0, linePartY + offsetY)) + offsetX
      } else if (y + offsetY < this.getLines.length) {
        newY = y + offsetY
        newX = offsetX
      } else {
        newY = this.getLines.length - 1
        newX = x
      }
    }

    return point.copy().reset(newX, newY)
  }

  computeLineHeight (linePoint: Point): number {
    const { linePartY } = this.getLinePartY(linePoint)
    return this._measureHtmlTool.computeLinePartDisplayHeight(this._lines[linePoint.y][linePartY])
  }

  splitElementByDisplayWidth (line: HTMLElement): IElementSplit[] {
    return this._measureHtmlTool.splitElementByDisplayWidth(line, this._lineBoundaries.width)
  }
}
