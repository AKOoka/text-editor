import { Point } from '../common/Point'

export class InteractiveHtmlElement {
  private readonly _context: HTMLElement

  constructor (context: HTMLElement) {
    this._context = context
  }

  get context (): HTMLElement {
    return this._context
  }

  setX (x: number): InteractiveHtmlElement {
    this._context.style.left = `${x}px`
    return this
  }

  setY (y: number): InteractiveHtmlElement {
    this._context.style.top = `${y}px`
    return this
  }

  setPoint (point: Point): InteractiveHtmlElement {
    this.setX(point.x)
    this.setY(point.y)

    return this
  }
}
