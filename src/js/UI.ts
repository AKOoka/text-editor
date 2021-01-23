// import { UIButton } from './UIButton'

class UI {
  private readonly _uiWrapper: HTMLDivElement

  get uiWrapper (): HTMLDivElement {
    return this._uiWrapper
  }

  constructor () {
    this._uiWrapper = document.createElement('div')
    this._uiWrapper.classList.add('ui-wrapper')
  }
}

export { UI }
