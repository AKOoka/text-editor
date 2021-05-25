import { ICommandDispatcher } from './ICommandDispatcher'
import { BaseCommand } from './commands/BaseCommand'
import { RequestType } from '../common/RequestType'
import { TextEditorResponse } from '../common/TextEditorResponse'

class HistoryCommandDispatcher implements ICommandDispatcher {
  private readonly _commandDispatcher: ICommandDispatcher
  private readonly _commandHistory: BaseCommand[]
  private _historyPointerOffset: number

  constructor (commandDispatcher: ICommandDispatcher) {
    this._commandDispatcher = commandDispatcher
    this._commandHistory = []
    this._historyPointerOffset = 0
  }

  doCommand (command: BaseCommand): void {
    this._commandDispatcher.doCommand(command)

    if (command.toBeSaved()) {
      this._commandHistory.push(command)
    }
  }

  undoCommand (): void {
    if (this._historyPointerOffset + 1 > this._commandHistory.length) {
      return
    }
    this._historyPointerOffset++
    this._commandDispatcher.undoCommand(this._commandHistory[this._commandHistory.length - this._historyPointerOffset])
  }

  redoCommand (): void {
    if (this._historyPointerOffset - 1 < 0) {
      return
    }
    this._historyPointerOffset--
    this._commandDispatcher.doCommand(this._commandHistory[this._commandHistory.length - 1 - this._historyPointerOffset])
  }

  fetchData (request: RequestType): TextEditorResponse {
    return this._commandDispatcher.fetchData(request)
  }
}

export { HistoryCommandDispatcher }
