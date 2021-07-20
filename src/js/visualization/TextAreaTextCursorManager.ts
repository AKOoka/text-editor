import { Point } from '../common/Point'
import { TextAreaContextWithMeasurer } from './TextAreaContextWithMeasurer'

export class TextAreaTextCursorManager {
  private readonly _context: TextAreaContextWithMeasurer
  private readonly _textCursorHtmlContext: HTMLElement

  constructor (context: TextAreaContextWithMeasurer) {
    this._context = context
    this._textCursorHtmlContext = this._createTextCursorHtmlContext()
  }

  private _createTextCursorHtmlContext (): HTMLElement {
    const htmlContext: HTMLElement = document.createElement('div')
    htmlContext.classList.add('text-cursor')
    return htmlContext
  }

  removeTextCursor (): void {
    this._textCursorHtmlContext.remove()
  }

  setTextCursorX (x: number): void {
    this._textCursorHtmlContext.style.left = `${x}px`
  }

  setTextCursorY (y: number): void {
    this._textCursorHtmlContext.style.top = `${y}px`
  }

  setTextCursorPoint (point: Point): void {
    const { displayPoint, linePartY } = this._context.convertPointToDisplayPoint(point)

    this._textCursorHtmlContext.remove()
    this._context.addNodeToLinePartEnd(point.y, linePartY, this._textCursorHtmlContext)

    this._textCursorHtmlContext.style.left = `${displayPoint.x}px`
    this._textCursorHtmlContext.style.height = `${this._context.measureLinePartDisplayHeight(point.y, linePartY)}px`
  }
}
