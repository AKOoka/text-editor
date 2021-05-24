abstract class BaseTextAreaLayer {
  protected readonly _context: HTMLElement

  protected constructor () {
    this._context = document.createElement('div')
  }

  getContext (): HTMLElement {
    return this._context
  }
}

export { BaseTextAreaLayer }
