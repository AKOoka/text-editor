import { ITextEditor } from '../../core/ITextEditor'
import { BaseCommand } from './BaseCommand'

class VerMoveTextCursor extends BaseCommand {
  private readonly _offset: number

  constructor (toBeSaved: boolean, offset: number) {
    super(toBeSaved)
    this._offset = offset
  }

  do (context: ITextEditor): void {
    context.verticalMoveTextCursor(this._offset)
    context.updateTextCursor()
  }

  undo (context: ITextEditor): void {
    context.verticalMoveTextCursor(-this._offset)
    context.updateTextCursor()
  }
}

export { VerMoveTextCursor }