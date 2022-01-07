import { ITextCursorPositionSubscriber } from '../common/ITextCursorPositionSubscriber'
import { ITextRepresentationSubscriber } from '../common/ITextRepresentationSubscriber'
import { ITextCursorSelectionsSubscriber } from '../common/ITextCursorSelectionsSubscriber'
import { IHtmlMeasurer } from './IHtmlMeasurer'
import { Point } from '../common/Point'
import { Selection } from '../common/Selection'
import {
  ITextRepresentationUpdate,
  ITextRepresentationUpdateAdd,
  ITextRepresentationUpdateChange,
  ITextRepresentationUpdateDelete,
  TextEditorRepresentationUpdateType
} from '../core/text-representation/ITextRepresentationUpdate'
import { TextAreaContextWithMeasurer } from './TextAreaContextWithMeasurer'
import { TextAreaTextManager } from './TextAreaTextManager'
import { TextAreaTextSelectionManager } from './TextAreaTextSelectionManager'
import { TextAreaTextCursorManager } from './TextAreaTextCursorManager'

type TextAreaUpdateLineFunction = (change: ITextRepresentationUpdateDelete) => void
type TextAreaUpdateLineFunctionRecord = Record<TextEditorRepresentationUpdateType, TextAreaUpdateLineFunction>

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
      [TextEditorRepresentationUpdateType.ADD]: this._lineAdd.bind(this),
      [TextEditorRepresentationUpdateType.DELETE]: this._lineDelete.bind(this),
      [TextEditorRepresentationUpdateType.CHANGE]: this._lineChange.bind(this)
    }
  }

  private _lineAdd (change: ITextRepresentationUpdateAdd): void {
    this._textManager.addTextLine(change.y, change.lineContent)
  }

  private _lineDelete (change: ITextRepresentationUpdateDelete): void {
    this._textManager.deleteTextLine(change.y)
  }

  private _lineChange (change: ITextRepresentationUpdateChange): void {
    this._textManager.changeTextLine(change.y, change.lineContent)
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

  updateTextRepresentation (changes: ITextRepresentationUpdate[]): void {
    for (const change of changes) {
      this._lineUpdateFunctions[change.type](change)
    }
  }
}

export { TextArea }
