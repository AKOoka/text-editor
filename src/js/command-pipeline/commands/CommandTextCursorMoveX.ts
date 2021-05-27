import { ITextEditor } from '../../core/ITextEditor'
import { BaseCommand } from './BaseCommand'

class CommandTextCursorMoveX extends BaseCommand {
  private readonly _offset: number

  constructor (toBeSaved: boolean, offset: number) {
    super(toBeSaved)
    this._offset = offset
  }

  do (context: ITextEditor): void {
    context.setTextCursorX(context.fetchData('textCursorX').textCursorX + this._offset)
    context.updateTextCursorPosition()
  }

  undo (context: ITextEditor): void {
    context.setTextCursorX(context.fetchData('textCursorX').textCursorX - this._offset)
    context.updateTextCursorPosition()
  }
}

export { CommandTextCursorMoveX }
