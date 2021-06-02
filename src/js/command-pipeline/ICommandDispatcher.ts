import { BaseCommand } from './commands/BaseCommand'

export interface ICommandDispatcher {
  doCommand: (command: BaseCommand) => void
  undoCommand: () => void
  redoCommand: () => void
}
