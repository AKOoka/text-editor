import { ITextCursorPositionSubscriber } from '../common/ITextCursorPositionSubscriber'
import { ITextRepresentationSubscriber } from '../common/ITextRepresentationSubscriber'
import { MeasureHtmlTool } from './MeasureHtmlTool'
import { ITextCursorSelectionsSubscriber } from '../common/ITextCursorSelectionsSubscriber'
import { TextAreaLayerText } from './TextAreaLayerText'
import { TextAreaLayerUi } from './TextAreaLayerUi'
import { ITextArea } from './ITextArea'
import { IPoint } from '../common/IPoint'
import { Selection } from '../common/Selection'
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
  private readonly _layerText: TextAreaLayerText
  private readonly _layerUi: TextAreaLayerUi
  private readonly _layerInteractive: HTMLElement
  private readonly _lineUpdateFunctions: TextAreaUpdateLineFunctionRecord

  constructor () {
    this._context = document.createElement('div')
    this._context.classList.add('text-area')
    this._measureHtmlTool = new MeasureHtmlTool()
    this._htmlCreator = new HtmlCreator()
    this._layerText = new TextAreaLayerText()
    this._layerUi = new TextAreaLayerUi()
    this._layerUi.addTextCursor()
    this._layerInteractive = document.createElement('div')
    this._layerInteractive.classList.add('text-area_layer-interactive')
    this._lineUpdateFunctions = {
      [TextEditorRepresentationUpdateLineType.ADD]: this._lineAdd.bind(this),
      [TextEditorRepresentationUpdateLineType.DELETE]: this._lineDelete.bind(this),
      [TextEditorRepresentationUpdateLineType.CHANGE]: this._lineChange.bind(this)
    }

    this._context.append(this._layerText.getContext(), this._layerUi.getContext(), this._layerInteractive)
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

  showInteractiveElement (displayPosition: IPoint, element: HTMLElement): void {
    const { x, y } = this._measureHtmlTool.normalizeDisplayPosition(displayPosition)
    element.style.left = `${x}px`
    element.style.top = `${y}px`
    this._layerInteractive.append(element)
  }

  init (): void {
    this._measureHtmlTool.setContext(this._context)
  }

  convertDisplayPosition (displayPosition: IPoint): IPoint {
    return this._measureHtmlTool.convertDisplayPosition(this._layerText.getAllTextLines(), displayPosition)
  }

  updateTextCursorPosition (position: IPoint): void {
    this._layerUi.setTextCursorX(this._measureHtmlTool.computePositionX(this._layerText.getTextLine(position.y), position.x))
    this._layerUi.setTextCursorY(this._measureHtmlTool.computePositionY(this._layerText.getAllTextLines(), position.y))
    this._layerUi.setTextCursorHeight(this._measureHtmlTool.computeLineHeight(this._layerText.getTextLine(position.y)))
  }

  updateTextCursorSelections (selections: Selection[]): void {
    this._layerUi.removeAllTextSelections()

    for (const sel of selections) {

    }
  }

  updateTextRepresentation (changes: ITextEditorRepresentationUpdateLine[]): void {
    for (const change of changes) {
      this._lineUpdateFunctions[change.type](change)
    }
  }
}

export { TextArea }
