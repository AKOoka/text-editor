import { ITextEditor } from '../core/ITextEditor'
import { BaseCommand } from './commands/BaseCommand'
import { TextEditorResponse } from '../common/TextEditorResponse'
import { TextEditorRequestType } from '../common/TextEditorRequestType'

class CommandDispatcher {
  private readonly _context: ITextEditor

  constructor (context: ITextEditor) {
    this._context = context
  }

  doCommand (command: BaseCommand): void {
    command.do(this._context)
  }

  undoCommand (command: BaseCommand): void {
    command.undo(this._context)
  }

  fetchData (request: TextEditorRequestType): TextEditorResponse {
    return this._context.fetchData(request)
  }
}

export { CommandDispatcher }
