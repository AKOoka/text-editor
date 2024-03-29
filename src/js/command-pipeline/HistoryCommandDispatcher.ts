import { ICommandDispatcher } from './ICommandDispatcher'
import { BaseCommand } from './commands/BaseCommand'
import { CommandDispatcher } from './CommandDispatcher'

class HistoryCommandDispatcher implements ICommandDispatcher {
  private readonly _commandDispatcher: CommandDispatcher
  private readonly _commandHistory: BaseCommand[]
  private _historyPointerOffset: number

  constructor (commandDispatcher: CommandDispatcher) {
    this._commandDispatcher = commandDispatcher
    this._commandHistory = []
    this._historyPointerOffset = 0
  }

  doCommand (command: BaseCommand): void {
    console.log(command, 'command')
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
}

export { HistoryCommandDispatcher }
