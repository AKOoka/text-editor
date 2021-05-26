import { ITextCursorPositionSubscriber } from '../common/ITextCursorPositionSubscriber'
import { ITextRepresentationSubscriber } from '../common/ITextRepresentationSubscriber'
import { TextRepresentationAction } from '../core/TextRepresentation/TextRepresentationAction'
import { TextRepresentationChange } from '../core/TextRepresentation/TextRepresentationChange'
import { TextAreaTextSelectionPool } from './TextAreaTextSelectionPool'
import { TextAreaTextPool } from './TextAreaTextPool'
import { MeasureHtmlTool } from './MeasureHtmlTool'
import { IRange } from '../common/IRange'
import { NodeRepresentation } from '../core/TextRepresentation/Nodes/NodeRepresentation'
import { NodeType } from '../core/TextRepresentation/Nodes/NodeType'
import { ITextCursorSelectionsSubscriber } from '../common/ITextCursorSelectionsSubscriber'
import { TextAreaLayerText } from './TextAreaLayerText'
import { TextAreaLayerUi } from './TextAreaLayerUi'
import { ITextArea } from './ITextArea'

class TextArea implements ITextArea, ITextRepresentationSubscriber, ITextCursorPositionSubscriber, ITextCursorSelectionsSubscriber {
  private readonly _context: HTMLElement
  private readonly _measureHtmlTool: MeasureHtmlTool
  private readonly _textSelectionPool: TextAreaTextSelectionPool
  private readonly _textPool: TextAreaTextPool
  private readonly _layerText: TextAreaLayerText
  private readonly _layerUi: TextAreaLayerUi
  private readonly _layerInteractive: HTMLElement

  constructor () {
    this._context = document.createElement('div')
    this._context.classList.add('text-area')
    this._measureHtmlTool = new MeasureHtmlTool()
    this._textPool = new TextAreaTextPool(1)
    this._textSelectionPool = new TextAreaTextSelectionPool(1)
    this._layerText = new TextAreaLayerText()
    this._layerUi = new TextAreaLayerUi()
    this._layerUi.addTextCursor()
    this._layerInteractive = document.createElement('div')
    this._layerInteractive.classList.add('text-area_layer-interactive')

    this._context.append(this._layerText.getContext(), this._layerUi.getContext(), this._layerInteractive)
  }

  private _generateHtmlNode (nodeRepresentation: NodeRepresentation): HTMLElement {
    let node: HTMLElement

    switch (nodeRepresentation.type) {
      case NodeType.TEXT:
        node = this._textPool.getNode()
        node.append(nodeRepresentation.text)
        return node
      case NodeType.TEXT_STYLE:
        node = this._textPool.getNode()
        node.classList.add(`${nodeRepresentation.textStyle}`)
        node.append(nodeRepresentation.text)
        return node
      case NodeType.CONTAINER_STYLE:
        node = this._textPool.getNode()
        node.classList.add(`${nodeRepresentation.textStyle}`)
        for (const child of nodeRepresentation.children) {
          node.append(this._generateHtmlNode(child))
        }
        return node
      case NodeType.CONTAINER_LINE:
        node = this._textPool.getTextLine()
        node.classList.add('text-line')
        for (const child of nodeRepresentation.children) {
          node.append(this._generateHtmlNode(child))
        }
        return node
      default:
        throw new Error("TextArea can't handle NodeRepresentation type")
    }
  }

  getContext (): HTMLElement {
    return this._context
  }

  getInteractiveLayerContext (): HTMLElement {
    return this._layerInteractive
  }

  init (): void {
    this._measureHtmlTool.setContext(this._context)
  }

  getTextPosition (displayX: number, displayY: number): { x: number, y: number } {
    return this._measureHtmlTool.getTextPosition(this._layerText.getAllTextLines(), displayX, displayY)
  }

  updateTextCursorPosition (x: number, y: number): void {
    this._layerUi.setTextCursorX(this._measureHtmlTool.computePositionX(this._layerText.getTextLine(y), x))
    this._layerUi.setTextCursorY(this._measureHtmlTool.computePositionY(this._layerText.getAllTextLines(), y))
    this._layerUi.setTextCursorHeight(this._measureHtmlTool.computeLineHeight(this._layerText.getTextLine(y)))
  }

  updateTextCursorSelections (selections: IRange[]): void {
    this._layerUi.removeAllTextSelections()
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
  }

  updateTextRepresentation (changes: TextRepresentationChange[]): void {
    for (const change of changes) {
      switch (change.getAction()) {
        case TextRepresentationAction.REMOVE:
          this._layerText.removeTextLine(change.getPosition())
          break
        case TextRepresentationAction.ADD:
          this._layerText.insertTextLine(change.getPosition(), this._generateHtmlNode(change.getNodeRepresentation()))
          break
        case TextRepresentationAction.CHANGE:
          this._layerText.changeTextLine(change.getPosition(), this._generateHtmlNode(change.getNodeRepresentation()))
          break
        default:
          throw new Error(`TextArea can't handle "${change.getAction()}" TextRepresentation action`)
      }
    }
  }
}

export { TextArea }
