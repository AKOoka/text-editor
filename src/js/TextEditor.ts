import { TextArea } from './TextArea'
import { UI } from './UI'

class TextEditor {
  private readonly _textEditorWrapper: HTMLDivElement
  private readonly _textArea: TextArea
  private readonly _ui: UI

  constructor () {
    this._textEditorWrapper = document.createElement('div')
    this._textArea = new TextArea()
    this._ui = new UI(this._textArea)

    this._textEditorWrapper.classList.add('text-editor')
    this._textEditorWrapper.append(this._ui.uiWrapper, this._textArea.textAreaWrapper)

    this._ui.generateButtons()
  }

  appendTo (rootSelector: string): void {
    const root: HTMLElement | null = document.querySelector(rootSelector)

    if (root === null) {
      throw new Error(`there is no html element with such query ${rootSelector}`)
    }

    root.append(this._textEditorWrapper)
  }
}

export { TextEditor }
