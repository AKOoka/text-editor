class TextAreaTextCursor {
  private readonly _context: HTMLElement

  constructor () {
    this._context = document.createElement('div')
    this._context.classList.add('text-cursor')
  }

  setY (y: number): void {
    this._context.style.top = `${y}px`
  }

  setX (x: number): void {
    this._context.style.left = `${x}px`
  }

  setHeight (height: number): void {
    this._context.style.height = `${height}px`
  }

  getContext (): HTMLElement {
    return this._context
  }

  removeContext (): void {
    this._context.remove()
  }
}

export { TextAreaTextCursor }
