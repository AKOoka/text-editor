import { BaseTextAreaLayer } from './BaseTextAreaLayer'
import { TextAreaTextCursor } from './TextAreaTextCursor'

class TextAreaLayerUi extends BaseTextAreaLayer {
  private readonly _textCursor: TextAreaTextCursor
  private _textSelection: HTMLElement[]

  constructor () {
    super()
    this._context.classList.add('text-area_layer-ui')

    this._textCursor = new TextAreaTextCursor()
    this._textSelection = []
  }

  removeTextCursor (): void {
    this._textCursor.removeContext()
  }

  addTextCursor (): void {
    this._context.append(this._textCursor.getContext())
  }

  setTextCursorX (x: number): void {
    this._textCursor.setX(x)
  }

  setTextCursorY (y: number): void {
    this._textCursor.setY(y)
  }

  setTextCursorHeight (height: number): void {
    this._textCursor.setHeight(height)
  }

  addTextSelection (selection: HTMLElement): void {
    this._context.append(selection)
    this._textSelection.push(selection)
  }

  removeAllTextSelections (): void {
    for (const textSelection of this._textSelection) {
      textSelection.remove()
    }
    this._textSelection = []
  }
}

export { TextAreaLayerUi }
