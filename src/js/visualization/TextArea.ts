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
  ITextEditorRepresentationUpdateLineAdd,
  ITextEditorRepresentationUpdateLineChange,
  ITextEditorRepresentationUpdateLineDelete,
  TextEditorRepresentationUpdateLineType
} from '../core/TextRepresentation/TextEditorRepresentationUpdateManager'

type TextAreaUpdateLineFunction = (change: ITextEditorRepresentationUpdateLineDelete) => void
type TextAreaUpdateLineFunctionRecord = Record<TextEditorRepresentationUpdateLineType, TextAreaUpdateLineFunction>

class TextArea implements ITextArea, ITextRepresentationSubscriber, ITextCursorPositionSubscriber, ITextCursorSelectionsSubscriber {
  private readonly _context: HTMLElement
  private readonly _measureHtmlTool: MeasureHtmlTool
  private readonly _htmlCreator: HtmlCreator
  private readonly _textSelectionPool: TextAreaTextSelectionPool
  private readonly _layerText: TextAreaLayerText
  private readonly _layerUi: TextAreaLayerUi
  private readonly _layerInteractive: HTMLElement
  private readonly _lineUpdateFunctions: TextAreaUpdateLineFunctionRecord

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
    this._lineUpdateFunctions = this._createUpdateLineFunctions()

    this._context.append(this._layerText.getContext(), this._layerUi.getContext(), this._layerInteractive)
  }

  private _createUpdateLineFunctions (): TextAreaUpdateLineFunctionRecord {
    return {
      [TextEditorRepresentationUpdateLineType.ADD]: this._lineAdd.bind(this),
      [TextEditorRepresentationUpdateLineType.DELETE]: this._lineDelete.bind(this),
      [TextEditorRepresentationUpdateLineType.CHANGE]: this._lineChange.bind(this)
    }
  }

  private _lineAdd (change: ITextEditorRepresentationUpdateLineAdd): void {
    this._layerText.insertTextLine(change.y, this._htmlCreator.createHtmlFromNodeRepresentation(change.nodeLineRepresentation))
  }

  private _lineDelete (change: ITextEditorRepresentationUpdateLineDelete): void {
    this._layerText.deleteTextLine(change.y)
  }

  private _lineChange (change: ITextEditorRepresentationUpdateLineChange): void {
    this._layerText.changeTextLine(change.y, this._htmlCreator.createHtmlFromNodeRepresentation(change.nodeLineRepresentation))
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
      this._lineUpdateFunctions[change.type](change)
    }
  }
}

export { TextArea }
