import { ITextCursorPositionSubscriber } from '../common/ITextCursorPositionSubscriber'
import { ITextRepresentationSubscriber } from '../common/ITextRepresentationSubscriber'
import { ITextCursorSelectionsSubscriber } from '../common/ITextCursorSelectionsSubscriber'
import { IHtmlMeasurer } from './IHtmlMeasurer'
import { Point } from '../common/Point'
import { Selection } from '../common/Selection'
import {
  ITextEditorRepresentationUpdateLine,
  ITextEditorRepresentationUpdateLineAdd,
  ITextEditorRepresentationUpdateLineChange,
  ITextEditorRepresentationUpdateLineDelete,
  TextEditorRepresentationUpdateLineType
} from '../core/TextRepresentation/TextEditorRepresentationUpdateManager'
import { TextAreaContextWithMeasurer } from './TextAreaContextWithMeasurer'
import { TextAreaTextManager } from './TextAreaTextManager'
import { TextAreaTextSelectionManager } from './TextAreaTextSelectionManager'
import { TextAreaTextCursorManager } from './TextAreaTextCursorManager'

type TextAreaUpdateLineFunction = (change: ITextEditorRepresentationUpdateLineDelete) => void
type TextAreaUpdateLineFunctionRecord = Record<TextEditorRepresentationUpdateLineType, TextAreaUpdateLineFunction>

class TextArea implements IHtmlMeasurer, ITextRepresentationSubscriber, ITextCursorPositionSubscriber, ITextCursorSelectionsSubscriber {
  private readonly _context: TextAreaContextWithMeasurer
  private readonly _textManager: TextAreaTextManager
  private readonly _textSelectionManager: TextAreaTextSelectionManager
  private readonly _textCursorManager: TextAreaTextCursorManager
  private readonly _lineUpdateFunctions: TextAreaUpdateLineFunctionRecord

  constructor () {
    this._context = new TextAreaContextWithMeasurer()
    this._textManager = new TextAreaTextManager(this._context)
    this._textSelectionManager = new TextAreaTextSelectionManager(this._context)
    this._textCursorManager = new TextAreaTextCursorManager(this._context)
    this._lineUpdateFunctions = {
      [TextEditorRepresentationUpdateLineType.ADD]: this._lineAdd.bind(this),
      [TextEditorRepresentationUpdateLineType.DELETE]: this._lineDelete.bind(this),
      [TextEditorRepresentationUpdateLineType.CHANGE]: this._lineChange.bind(this)
    }
  }

  private _lineAdd (change: ITextEditorRepresentationUpdateLineAdd): void {
    this._textManager.addTextLine(change.y, change.nodeLineRepresentation)
  }

  private _lineDelete (change: ITextEditorRepresentationUpdateLineDelete): void {
    this._textManager.deleteTextLine(change.y)
  }

  private _lineChange (change: ITextEditorRepresentationUpdateLineChange): void {
    this._textManager.changeTextLine(change.y, change.nodeLineRepresentation)
  }

  init (): void {
    this._context.init()
    this._textCursorManager.addTextCursor()
  }

  getContext (): HTMLElement {
    return this._context.getHtmlContext()
  }

  convertDisplayPointToPoint (displayPoint: Point): Point {
    return this._context.convertDisplayPointToPoint(displayPoint)
  }

  translatePoint (point: Point, offsetY: number): Point {
    return this._context.translatePoint(point, offsetY)
  }

  updateTextCursorPosition (point: Point): void {
    this._textCursorManager.setTextCursorPoint(point)
  }

  updateTextCursorSelections (selections: Selection[]): void {
    this._textSelectionManager.removeAllTextSelections()
    for (const s of selections) {
      this._textSelectionManager.addSelection(s)
    }
  }

  updateTextRepresentation (changes: ITextEditorRepresentationUpdateLine[]): void {
    for (const change of changes) {
      this._lineUpdateFunctions[change.type](change)
    }
  }
}

export { TextArea }
