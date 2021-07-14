import { ITextCursorPositionSubscriber } from '../common/ITextCursorPositionSubscriber'
import { ITextRepresentationSubscriber } from '../common/ITextRepresentationSubscriber'
import { ITextCursorSelectionsSubscriber } from '../common/ITextCursorSelectionsSubscriber'
import { ITextArea } from './ITextArea'
import { Point } from '../common/Point'
import { Selection } from '../common/Selection'
import {
  ITextEditorRepresentationUpdateLine,
  ITextEditorRepresentationUpdateLineAdd,
  ITextEditorRepresentationUpdateLineChange,
  ITextEditorRepresentationUpdateLineDelete,
  TextEditorRepresentationUpdateLineType
} from '../core/TextRepresentation/TextEditorRepresentationUpdateManager'
import { Range } from '../common/Range'
import { TextAreaLayerTextCursor } from './TextAreaLayerTextCursor'
import { TextAreaLayerTextWithTextSelection } from './TextAreaLayerTextWithTextSelection'

type TextAreaUpdateLineFunction = (change: ITextEditorRepresentationUpdateLineDelete) => void
type TextAreaUpdateLineFunctionRecord = Record<TextEditorRepresentationUpdateLineType, TextAreaUpdateLineFunction>

class TextArea implements ITextArea, ITextRepresentationSubscriber, ITextCursorPositionSubscriber, ITextCursorSelectionsSubscriber {
  private readonly _context: HTMLElement
  private readonly _layerText: TextAreaLayerTextWithTextSelection
  private readonly _layerTextCursor: TextAreaLayerTextCursor
  private readonly _layerInteractive: HTMLElement
  private readonly _lineUpdateFunctions: TextAreaUpdateLineFunctionRecord

  constructor () {
    this._context = document.createElement('div')
    this._context.classList.add('text-area')
    this._layerText = new TextAreaLayerTextWithTextSelection()
    this._layerTextCursor = new TextAreaLayerTextCursor()
    this._layerTextCursor.addTextCursor()
    this._layerInteractive = document.createElement('div')
    this._layerInteractive.classList.add('text-area_layer-interactive')
    this._lineUpdateFunctions = {
      [TextEditorRepresentationUpdateLineType.ADD]: this._lineAdd.bind(this),
      [TextEditorRepresentationUpdateLineType.DELETE]: this._lineDelete.bind(this),
      [TextEditorRepresentationUpdateLineType.CHANGE]: this._lineChange.bind(this)
    }

    this._context.append(this._layerText.context, this._layerTextCursor.context, this._layerInteractive)
  }

  private _lineAdd (change: ITextEditorRepresentationUpdateLineAdd): void {
    this._layerText.addTextLine(change.y, change.nodeLineRepresentation)
  }

  private _lineDelete (change: ITextEditorRepresentationUpdateLineDelete): void {
    this._layerText.deleteTextLine(change.y)
  }

  private _lineChange (change: ITextEditorRepresentationUpdateLineChange): void {
    this._layerText.changeTextLine(change.y, change.nodeLineRepresentation)
  }

  getContext (): HTMLElement {
    return this._context
  }

  getInteractiveLayerContext (): HTMLElement {
    return this._layerInteractive
  }

  init (): void {
    this._layerText.init(this._context, new Range(0, this._context.offsetWidth))
    console.log('line boundaries', this._context.offsetWidth)
  }

  showInteractiveElement (displayPoint: Point, element: HTMLElement, normalize: boolean = true): void {
    let point = displayPoint

    if (normalize) {
      point = this._layerText.normalizeDisplayPoint(displayPoint)
    }

    element.style.left = `${point.x}px`
    element.style.top = `${point.y}px`
    this._layerInteractive.append(element)
  }

  convertDisplayPointToPoint (displayPoint: Point): Point {
    return this._layerText.convertDisplayPointToPoint(displayPoint)
  }

  moveTextCursorDisplayY (point: Point, offsetY: number): Point {
    return this._layerText.movePointByDisplayY(point, offsetY)
  }

  updateTextCursorPosition (point: Point): void {
    this._layerTextCursor.setTextCursorPoint(this._layerText.convertPointToDisplayPoint(point))
    this._layerTextCursor.setTextCursorHeight(this._layerText.computeLineHeight(point))
  }

  updateTextCursorSelections (selections: Selection[]): void {
    this._layerText.removeAllTextSelections()
    for (const s of selections) {
      this._layerText.addSelection(s)
    }
  }

  updateTextRepresentation (changes: ITextEditorRepresentationUpdateLine[]): void {
    for (const change of changes) {
      this._lineUpdateFunctions[change.type](change)
    }
  }
}

export { TextArea }
