class TextAreaTextCursor {
  private readonly _htmlElement: HTMLElement
  private _y: number

  constructor () {
    this._htmlElement = document.createElement('div')
    this._htmlElement.classList.add('text-cursor')
  }

  getY (): number {
    return this._y
  }

  setY (y: number): void {
    this._y = y
  }

  setX (x: number): void {
    this._htmlElement.style.left = `${x}px`
  }

  getHtmlElement (): HTMLElement {
    return this._htmlElement
  }

  removeHtmlElement (): void {
    this._htmlElement.remove()
  }
}

export { TextAreaTextCursor }
