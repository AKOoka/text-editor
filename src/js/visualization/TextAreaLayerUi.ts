import { BaseTextAreaLayer } from './BaseTextAreaLayer'
import { TextAreaTextCursor } from './TextAreaTextCursor'
import { TextAreaTextSelectionPool } from './TextAreaTextSelectionPool'

class TextAreaLayerUi extends BaseTextAreaLayer {
  private readonly _textCursor: TextAreaTextCursor
  private readonly _textSelectionPool: TextAreaTextSelectionPool
  private _textSelection: HTMLElement[]

  constructor () {
    super()
    this._context.classList.add('text-area_layer-ui')

    this._textCursor = new TextAreaTextCursor()
    this._textSelectionPool = new TextAreaTextSelectionPool(1)
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

  addTextSelection (selection: Selection): void {
    const sel = this._textSelectionPool.updateSelections(selections)

    for (let i = 0; i < sel.length; i++) {
      let part = sel[i][0]
      const left = this._measureHtmlTool.computePositionX(this._layerText.getTextLine(part.y), part.left)
      this._layerUi.addTextSelection(part.htmlElement)
      part.htmlElement.style.left = `${left}px`
      part.htmlElement.style.height = `${this._measureHtmlTool.computePositionY(this._layerText.getAllTextLines(), part.y)}`
      part.htmlElement.style.height = `${this._measureHtmlTool.computeLineHeight(this._layerText.getTextLine(part.y))}px`

      if (sel[i].length === 1) {
        part.htmlElement.style.width =
          `${left + this._measureHtmlTool.computePositionX(this._layerText.getTextLine(part.y), part.right)}px`
        continue
      }

      part.htmlElement.style.right = '0px'

      for (let l = 1; l < sel[i].length - 1; l++) {
        part = sel[i][l]
        this._layerUi.addTextSelection(part.htmlElement)
        part.htmlElement.style.left = '0px'
        part.htmlElement.style.right = '0px'
        part.htmlElement.style.top = `${this._measureHtmlTool.computePositionY(this._layerText.getAllTextLines(), part.y)}`
        part.htmlElement.style.height = `${this._measureHtmlTool.computeLineHeight(this._layerText.getTextLine(part.y))}px`
      }

      part = sel[i][sel[i].length - 1]
      this._layerUi.addTextSelection(part.htmlElement)
      part.htmlElement.style.left = '0px'
      part.htmlElement.style.top = `${this._measureHtmlTool.computePositionY(this._layerText.getAllTextLines(), part.y)}`
      part.htmlElement.style.height = `${this._measureHtmlTool.computeLineHeight(this._layerText.getTextLine(part.y))}px`
      part.htmlElement.style.width =
        `${this._measureHtmlTool.computePositionX(this._layerText.getTextLine(part.y), part.right)}px`
    }

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
