import { Point } from '../common/Point'
import { Range } from '../common/Range'
import { HtmlCreator } from './HtmlCreator'
import { MeasureHtmlTool } from './MeasureHtmlTool'
import { TextAreaLayerTextContext } from './TextAreaLayerTextContext'

export class BaseTextAreaLayerText {
  protected readonly _context: TextAreaLayerTextContext
  protected readonly _htmlCreator: HtmlCreator
  protected readonly _measureHtmlTool: MeasureHtmlTool

  constructor () {
    this._context = new TextAreaLayerTextContext()
    this._htmlCreator = new HtmlCreator()
    this._measureHtmlTool = new MeasureHtmlTool()
  }

  get context (): HTMLElement {
    return this._context.contextHtml
  }

  init (context: HTMLElement, lineBoundaries: Range): void {
    this._measureHtmlTool.setContext(context)
    this._context.init(lineBoundaries)
  }

  normalizeDisplayPoint (displayPoint: Point): Point {
    return this._measureHtmlTool.normalizeDisplayPoint(displayPoint)
  }

  convertDisplayPointToPoint (displayPoint: Point): Point {
    const { y, partY } = this._measureHtmlTool.convertDisplayYToY(this._context.lines, displayPoint.y)
    return displayPoint.copy().reset(
      this._measureHtmlTool.convertDisplayXToX(this._context.getLinePartConcrete(y, partY), displayPoint.x),
      y
    )
  }

  convertPointToDisplayPoint (point: Point): Point {
    const { linePartY, linePartOffsetX } = this._context.getLinePartY(point)
    return point.copy().reset(
      this._measureHtmlTool.convertXToDisplayX(this._context.getLinePartConcrete(point.y, linePartY), point.x - linePartOffsetX),
      this._measureHtmlTool.convertYToDisplayY(this._context.lines, point.y, linePartY)
    )
  }

  computeLineHeight (linePoint: Point): number {
    const { linePartY } = this._context.getLinePartY(linePoint)
    return this._measureHtmlTool.computeLineHeight(this._context.getLinePartConcrete(linePoint.y, linePartY))
  }
}
