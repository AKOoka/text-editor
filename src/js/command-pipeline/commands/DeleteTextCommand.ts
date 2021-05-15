import { ITextEditor } from '../../core/ITextEditor'
import { BaseCommand } from './BaseCommand'

class DeleteTextCommand extends BaseCommand {
  private readonly _deleteOffset: number
  private readonly _deleteMove: number

  constructor (toBeSaved: boolean, deleteOffset: number, deleteMove: number) {
    super(toBeSaved)
    this._deleteOffset = deleteOffset
    this._deleteMove = deleteMove
  }

  do (context: ITextEditor): void {
    const lineDeleted: boolean = context.deleteTextOnTextCursor(this._deleteOffset)
    context.deleteTextOnSelection()
    if (lineDeleted) {
      context.verticalMoveTextCursor(-1)
      context.horizontalMoveTextCursor(Infinity)
    } else {
      context.horizontalMoveTextCursor(this._deleteMove)
    }
    context.updateTextRepresentation()
    context.updateTextCursor()
  }

  undo (context: ITextEditor): void {
    console.log(context)
  }
}

export { DeleteTextCommand }
