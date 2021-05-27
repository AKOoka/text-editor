import { ITextEditor } from '../../core/ITextEditor'
import { BaseCommand } from './BaseCommand'

class CommandTextDelete extends BaseCommand {
  private readonly _deleteOffset: number
  private readonly _deleteMove: number

  constructor (toBeSaved: boolean, deleteOffset: number, deleteMove: number) {
    super(toBeSaved)
    this._deleteOffset = deleteOffset
    this._deleteMove = deleteMove
  }

  do (context: ITextEditor): void {
    const lineLength: number = context.fetchData('textLength').textLength
    // context.deleteTextInRange(this._deleteOffset)
    // context.deleteTextInSelections()
    if (lineLength === 0) {
      // context.moveTextCursorYPosition(-1)
      // context.moveTextCursorXPosition(Infinity)
    } else {
      // context.moveTextCursorXPosition(this._deleteMove)
    }
    console.log(this._deleteMove, this._deleteOffset)
    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }

  undo (context: ITextEditor): void {
    console.log(context)
  }
}

export { CommandTextDelete }
