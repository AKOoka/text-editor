import { ITextEditor } from '../core/ITextEditor'
import { BaseCommand } from './commands/BaseCommand'
import { TextEditorResponse } from '../common/TextEditorResponse'
import { TextEditorRequest } from '../common/TextEditorRequest'

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

  fetchData (requests: TextEditorRequest[]): TextEditorResponse {
    return this._context.fetchData(requests)
  }
}

export { CommandDispatcher }
