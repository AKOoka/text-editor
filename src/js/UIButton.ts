class UIButton {
  private readonly _button: HTMLButtonElement

  get button (): HTMLButtonElement {
    return this._button
  }

  constructor (textContent: string, className: string, clickCallback: () => void) {
    this._button = document.createElement('button')
    this._button.textContent = textContent
    this._button.classList.add(className)
    this._button.click = clickCallback
  }
}

export { UIButton }
