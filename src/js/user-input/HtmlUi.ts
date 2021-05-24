import { TextStyleType } from '../common/TextStyleType'
import { IActiveTextStylesSubscriber } from '../common/IActiveTextStylesSubscriber'

class HtmlUi implements IActiveTextStylesSubscriber {
  private readonly _context: HTMLElement
  private readonly _buttons: Map<string, HTMLElement>

  constructor () {
    this._context = document.createElement('div')
    this._context.classList.add('ui')
    this._buttons = new Map()
  }

  private _createHtmlButton (popupText: string, handler: () => void): HTMLElement {
    const button = document.createElement('button')
    button.classList.add('ui-button')
    button.textContent = popupText
    button.title = popupText
    button.onclick = handler
    return button
  }

  createButton (type: string, popupText: string, handler: () => void): void {
    const newButton = this._createHtmlButton(popupText, handler)
    this._buttons.set(type, newButton)
    this._context.append(newButton)
  }

  getContext (): HTMLElement {
    return this._context
  }

  updateActiveTextStyles (activeTextStyles: TextStyleType[]): void {
    for (const [buttonType, button] of this._buttons.entries()) {
      if (activeTextStyles.includes(buttonType as TextStyleType)) {
        button.classList.add('button-active')
        continue
      }
      button.classList.remove('button-active')
    }
  }
}

export { HtmlUi }
