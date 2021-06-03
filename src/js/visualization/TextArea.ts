import { ITextCursorPositionSubscriber } from '../common/ITextCursorPositionSubscriber'
import { ITextRepresentationSubscriber } from '../common/ITextRepresentationSubscriber'
import { TextAreaTextSelectionPool } from './TextAreaTextSelectionPool'
import { MeasureHtmlTool } from './MeasureHtmlTool'
import { ITextCursorSelectionsSubscriber } from '../common/ITextCursorSelectionsSubscriber'
import { TextAreaLayerText } from './TextAreaLayerText'
import { TextAreaLayerUi } from './TextAreaLayerUi'
import { ITextArea } from './ITextArea'
import { IPoint } from '../common/IPoint'
import { ISelection } from '../common/ISelection'
import { HtmlCreator } from './HtmlCreator'
import {
  ITextEditorRepresentationUpdateLine,
  TextEditorRepresentationUpdateLineType
} from '../core/TextRepresentation/TextEditorRepresentationUpdateManager'
import { NodeRepresentation, NodeRepresentationType } from '../core/TextRepresentation/NodeRepresentation'
import { TextEditorRepresentationUpdateNodeType } from '../core/TextRepresentation/NodeUpdatesManager'

type TextAreaUpdateFunction = (change: ITextEditorRepresentationUpdateLine) => void

class TextArea implements ITextArea, ITextRepresentationSubscriber, ITextCursorPositionSubscriber, ITextCursorSelectionsSubscriber {
  private readonly _context: HTMLElement
  private readonly _measureHtmlTool: MeasureHtmlTool
  private readonly _htmlCreator: HtmlCreator
  private readonly _textSelectionPool: TextAreaTextSelectionPool
  private readonly _layerText: TextAreaLayerText
  private readonly _layerUi: TextAreaLayerUi
  private readonly _layerInteractive: HTMLElement
  private readonly _updateFunction: Record<TextEditorRepresentationUpdateLineType, TextAreaUpdateFunction>

  constructor () {
    this._context = document.createElement('div')
    this._context.classList.add('text-area')
    this._measureHtmlTool = new MeasureHtmlTool()
    this._htmlCreator = new HtmlCreator()
    this._textSelectionPool = new TextAreaTextSelectionPool(1)
    this._layerText = new TextAreaLayerText()
    this._layerUi = new TextAreaLayerUi()
    this._layerUi.addTextCursor()
    this._layerInteractive = document.createElement('div')
    this._layerInteractive.classList.add('text-area_layer-interactive')
    this._updateFunction = this._createUpdateFunctions()

    this._context.append(this._layerText.getContext(), this._layerUi.getContext(), this._layerInteractive)
  }

  private _createUpdateFunctions (): Record<TextEditorRepresentationUpdateLineType, TextAreaUpdateFunction> {
    return {
      [TextEditorRepresentationUpdateLineType.ADD]: this._addLine,
      [TextEditorRepresentationUpdateLineType.DELETE]: this._deleteLine,
      [TextEditorRepresentationUpdateLineType.CHANGE]: this._changeLine
    }
  }

  private _addLine (change: ITextEditorRepresentationUpdateLine): void {
    this._layerText.insertTextLine(change.y, this._htmlCreator.createHtmlElement(NodeRepresentationType.LINE))
  }

  private _deleteLine (change: ITextEditorRepresentationUpdateLine): void {
    this._layerText.deleteTextLine(change.y)
  }

  private _changeLine (change: {
    y: number
    type: TextEditorRepresentationUpdateLineType
    nodeUpdates: Array<{
      route: number[]
      type: TextEditorRepresentationUpdateNodeType
      content: NodeRepresentation[]
    }>
  }): void {
    for (const { type, content, route } of change.nodeUpdates) {
      switch (type) {
        case TextEditorRepresentationUpdateNodeType.ADD:
          for (let i = 0; i < content.length; i++) {
            route[route.length - 1] = route[route.length - 1] + i
            this._layerText.addNode(change.y, route, this._htmlCreator.createHtmlFromNodeRepresentation(content[i]))
          }
          break
        case TextEditorRepresentationUpdateNodeType.DELETE:
          this._layerText.deleteNode(change.y, route)
          break
        case TextEditorRepresentationUpdateNodeType.CHANGE:
          this._layerText.changeNode(change.y, route, content.map(c => this._htmlCreator.createHtmlFromNodeRepresentation(c)))
      }
    }
  }

  getContext (): HTMLElement {
    return this._context
  }

  getInteractiveLayerContext (): HTMLElement {
    return this._layerInteractive
  }

  showElementOnInteractiveLayer (displayPosition: IPoint, element: HTMLElement): void {
    const { x, y } = this._measureHtmlTool.normalizeDisplayPosition(displayPosition)
    element.style.left = `${x}px`
    element.style.top = `${y}px`
    this._layerInteractive.append(element)
  }

  init (): void {
    this._measureHtmlTool.setContext(this._context)
  }

  convertToTextPosition (displayPosition: IPoint): IPoint {
    return this._measureHtmlTool.convertDisplayPosition(this._layerText.getAllTextLines(), displayPosition)
  }

  updateTextCursorPosition (position: IPoint): void {
    this._layerUi.setTextCursorX(this._measureHtmlTool.computePositionX(this._layerText.getTextLine(position.y), position.x))
    this._layerUi.setTextCursorY(this._measureHtmlTool.computePositionY(this._layerText.getAllTextLines(), position.y))
    this._layerUi.setTextCursorHeight(this._measureHtmlTool.computeLineHeight(this._layerText.getTextLine(position.y)))
  }

  updateTextCursorSelections (selections: ISelection[]): void {
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

  updateTextRepresentation (changes: ITextEditorRepresentationUpdateLine[]): void {
    for (const change of changes) {
      this._updateFunction[change.type](change)
    }
  }
}

export { TextArea }
