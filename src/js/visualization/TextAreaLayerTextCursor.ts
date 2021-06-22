import { Point } from '../common/Point'

export class TextAreaLayerTextCursor {
  private readonly _layerContext: HTMLElement
  private readonly _textCursorContext: HTMLElement

  constructor () {
    this._layerContext = document.createElement('div')
    this._layerContext.classList.add('text-area_layer-text-cursor')
    this._textCursorContext = document.createElement('div')
    this._textCursorContext.classList.add('text-cursor')
  }

  get context (): HTMLElement {
    return this._layerContext
  }

  removeTextCursor (): void {
    this._textCursorContext.remove()
  }

  addTextCursor (): void {
    this._layerContext.append(this._textCursorContext)
  }

  setTextCursorX (x: number): void {
    this._textCursorContext.style.left = `${x}px`
  }

  setTextCursorY (y: number): void {
    this._textCursorContext.style.top = `${y}px`
  }

  setTextCursorPoint (point: Point): void {
    this._textCursorContext.style.left = `${point.x}px`
    this._textCursorContext.style.top = `${point.y}px`
  }

  setTextCursorHeight (height: number): void {
    this._textCursorContext.style.height = `${height}px`
  }
}
