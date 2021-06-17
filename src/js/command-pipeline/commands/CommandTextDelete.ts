import { ITextEditor } from '../../core/ITextEditor'
import { BaseCommand } from './BaseCommand'
import { Range } from '../../common/Range'
import { INodeCopy } from '../../core/TextRepresentation/Nodes/INode'
import { Selection } from '../../common/Selection'

class CommandTextDelete extends BaseCommand {
  private readonly _leftOffset: number
  private readonly _rightOffset: number
  private _deletedContent: INodeCopy[]
  // private _lineDeleted: boolean

  constructor (toBeSaved: boolean, leftOffset: number, rightOffset: number) {
    super(toBeSaved)
    this._leftOffset = leftOffset
    this._rightOffset = rightOffset
  }

  do (context: ITextEditor): void {
    const textCursorPoint = context.getTextCursorPosition()
    const { x, y } = textCursorPoint
    const textLength = context.getLineLength(y)
    const textLineCount = context.getLinesCount()

    this._deletedContent = context.getContentInSelections([
      new Selection(new Range(x + this._leftOffset, x + this._rightOffset), new Range(y, y))
    ])

    if (textLength === 0) {
      if (textLineCount === 1) {
        return
      }

      context.deleteLinesInRange(new Range(y, y + 1 <= textLineCount ? y + 1 : textLineCount))
      if (this._leftOffset < 0) {
        const newTextLength = context.getLineLength(y + this._leftOffset)
        context.setTextCursorPosition(textCursorPoint.reset(newTextLength, y + this._leftOffset))
      }
    } else {
      context.deleteTextInRange(y, new Range(x + this._leftOffset, x + this._rightOffset))
      context.setTextCursorX(x + this._leftOffset)
    }
    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }

  undo (context: ITextEditor): void {
    const textCursorPoint = context.getTextCursorPosition()
    const { x, y } = textCursorPoint
    context.addContent(textCursorPoint.reset(x, y), this._deletedContent)
    context.setTextCursorX(x - this._leftOffset)
    // if (this._lineDeleted) {}
    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }
}

export { CommandTextDelete }
