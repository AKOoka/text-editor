import { AddTextCommand } from './commandPipeline/AddTextCommand'
import { ICommandDispatcher } from './commandPipeline/ICommandDispatcher'

class IoDevice {
  private readonly _commandDispatcher: ICommandDispatcher
  private readonly _context: Document

  constructor (commandDispatcher: ICommandDispatcher) {
    this._commandDispatcher = commandDispatcher
    this._context = document
  }

  // i can make it with chain of responsibility pattern
  setHandlersOnKeyDown (): void {
    this._context.onkeydown = (e) => {
      this._commandDispatcher.doCommand(new AddTextCommand(e.key, false))
    }
  }
}

export { IoDevice }
