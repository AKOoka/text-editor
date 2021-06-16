import { Range } from '../common/Range'
import { Selection } from '../common/Selection'
import { BaseTextAreaLayer } from './BaseTextAreaLayer'
import { HtmlElementPool } from './HtmlElementPool'
import { TextAreaTextCursor } from './TextAreaTextCursor'

export interface SelectionPart {
  y: number
  rangeX: Range
}

class TextAreaLayerUi extends BaseTextAreaLayer {
  private readonly _textCursor: TextAreaTextCursor
  private readonly _htmlElementPool: HtmlElementPool
  private _textSelection: HTMLElement[]

  constructor () {
    super()
    this._context.classList.add('text-area_layer-ui')

    this._textCursor = new TextAreaTextCursor()
    this._htmlElementPool = new HtmlElementPool()
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

  splitSelectionIntoParts (selection: Selection, linesTextLength: number[]): SelectionPart[] {
    const selectionParts: SelectionPart[] = []

    if (selection.rangeY.width === 0) {
      selectionParts.push({ y: selection.startY, rangeX: selection.rangeX })
      return selectionParts
    }

    selectionParts.push({ y: selection.startY, rangeX: new Range(selection.startX, linesTextLength[selection.startY]) })

    for (let i = selection.startY + 1; i < selection.endY; i++) {
      selectionParts.push({ y: i, rangeX: new Range(0, linesTextLength[i]) })
    }

    selectionParts.push({ y: selection.endY, rangeX: new Range(0, selection.endX) })

    return selectionParts
  }

  addSelectionPart (selectionPart: SelectionPart, lineHeight: number): void {
    const selectionPartHtml = this._htmlElementPool.getNode()
    const { y, rangeX: { start: left, width } } = selectionPart

    selectionPartHtml.classList.add('text-selection')
    selectionPartHtml.style.top = `${y}px`
    selectionPartHtml.style.left = `${left}px`
    selectionPartHtml.style.width = `${width}px`
    selectionPartHtml.style.height = `${lineHeight}px`

    this._context.append(selectionPartHtml)
    this._textSelection.push(selectionPartHtml)
  }

  removeAllTextSelections (): void {
    for (const textSelection of this._textSelection) {
      textSelection.remove()
    }
    this._textSelection = []
  }
}

export { TextAreaLayerUi }
