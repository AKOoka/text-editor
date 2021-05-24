import { ITextEditor } from '../../core/ITextEditor'
import { BaseCommand } from './BaseCommand'

class VerMoveTextCursor extends BaseCommand {
  private readonly _offset: number

  constructor (toBeSaved: boolean, offset: number) {
    super(toBeSaved)
    this._offset = offset
  }

  do (context: ITextEditor): void {
    context.moveTextCursorYPosition(this._offset)
    context.updateTextCursorPosition()
  }

  undo (context: ITextEditor): void {
    context.moveTextCursorYPosition(-this._offset)
    context.updateTextCursorPosition()
  }
}

export { VerMoveTextCursor }
