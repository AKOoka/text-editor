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
      context.moveTextCursorYPosition(-1)
      context.moveTextCursorXPosition(Infinity)
    } else {
      context.moveTextCursorXPosition(this._deleteMove)
    }
    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }

  undo (context: ITextEditor): void {
    console.log(context)
  }
}

export { DeleteTextCommand }
