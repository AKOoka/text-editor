import { ICommandDispatcher } from '../../../command-pipeline/ICommandDispatcher'

abstract class BaseMouseHandler {
  protected readonly _commandDispatcher: ICommandDispatcher

  constructor (commandDispatcher: ICommandDispatcher) {
    this._commandDispatcher = commandDispatcher
  }

  abstract handleEvent (e: MouseEvent): void
}

export { BaseMouseHandler }
