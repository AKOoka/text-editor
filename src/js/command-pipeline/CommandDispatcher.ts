import { ICommand } from './ICommand'
import { ICommandDispatcher } from './ICommandDispatcher'
import { ITextEditor } from '../core/ITextEditor'

class CommandDispatcher implements ICommandDispatcher {
  private readonly _context: ITextEditor

  constructor (context: ITextEditor) {
    this._context = context
  }

  doCommand (command: ICommand): void {
    command.do(this._context)
  }

  undoCommand (command: ICommand): void {
    command.undo(this._context)
  }
}

export { CommandDispatcher }
