import { ICommandDispatcher } from './ICommandDispatcher'
import { ITextEditor } from '../core/ITextEditor'
import { BaseCommand } from './commands/BaseCommand'
import { RequestType } from '../common/RequestType'
import { TextEditorResponse } from '../common/TextEditorResponse'

class CommandDispatcher implements ICommandDispatcher {
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

  fetchData (request: RequestType): TextEditorResponse {
    return this._context.fetchData(request)
  }
}

export { CommandDispatcher }
