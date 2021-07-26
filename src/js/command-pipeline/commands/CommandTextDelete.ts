import { ITextEditor } from '../../core/ITextEditor'
import { BaseCommand } from './BaseCommand'
import { Range } from '../../common/Range'
import { Selection } from '../../common/Selection'
import { CommandTextCursorMoveX } from './CommandTextCursorMoveX'
import { ILineContent } from '../../core/TextRepresentation/ILineContent'

class CommandTextDelete extends BaseCommand {
  private readonly _leftOffset: number
  private readonly _rightOffset: number
  private readonly _commandTextCursorMoveX: CommandTextCursorMoveX
  private _deletedContent: ILineContent[]

  constructor (toBeSaved: boolean, leftOffset: number, rightOffset: number) {
    super(toBeSaved)
    this._leftOffset = leftOffset
    this._rightOffset = rightOffset
    this._commandTextCursorMoveX = new CommandTextCursorMoveX(false, this._leftOffset)
  }

  do (context: ITextEditor): void {
    const textCursorPoint = context.getTextCursorPoint()
    const { x, y } = textCursorPoint

    this._deletedContent = context.getContentInSelections([
      new Selection(new Range(x + this._leftOffset, x + this._rightOffset), new Range(y, y))
    ])
    context.deleteTextInRange(y, new Range(x + this._leftOffset, x + this._rightOffset))
    context.updateTextRepresentation()
    if (this._leftOffset !== 0) {
      this._commandTextCursorMoveX.do(context)
    }
  }

  undo (context: ITextEditor): void {
    const textCursorPoint = context.getTextCursorPoint()
    const { x, y } = textCursorPoint
    context.addContent(textCursorPoint.reset(x, y), this._deletedContent)
    context.updateTextRepresentation()
    if (this._leftOffset !== 0) {
      this._commandTextCursorMoveX.undo(context)
    }
  }
}

export { CommandTextDelete }
