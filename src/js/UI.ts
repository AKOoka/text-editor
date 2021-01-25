import { TextArea } from './TextArea'
import { UIButton } from './UIButton'

class UI {
  private readonly _uiWrapper: HTMLDivElement
  private readonly _buttons: UIButton[]
  private readonly _textArea: TextArea

  get uiWrapper (): HTMLDivElement {
    return this._uiWrapper
  }

  constructor (textArea: TextArea) {
    this._uiWrapper = document.createElement('div')
    this._uiWrapper.classList.add('ui')

    this._buttons = []

    this._textArea = textArea
  }

  generateButtons (): void {
    this._buttons.push(
      new UIButton('bold', 'bold', () => { this._textArea.addTextStyle('bold') }),
      new UIButton('italic', 'italic', () => { this._textArea.addTextStyle('italic') }),
      new UIButton('through', 'through', () => { this._textArea.addTextStyle('through') })
    )

    for (const btn of this._buttons) {
      this._uiWrapper.append(btn.button)
    }
  }
}

export { UI }
