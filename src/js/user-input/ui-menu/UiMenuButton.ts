export class UiMenuButton {
  private readonly _context: HTMLElement

  constructor (text: string, popupText: string) {
    this._context = document.createElement('button')
    this._context.classList.add('ui-button')
    this._context.textContent = text
    this._context.title = popupText
  }

  get context (): HTMLElement {
    return this._context
  }

  setActiveState (activeState: boolean): void {
    if (activeState) {
      this._context.classList.add('button-active')
    } else {
      this._context.classList.remove('button-active')
    }
  }
}
