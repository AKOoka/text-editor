import { ICommand } from './ICommand'

export interface ICommandDispatcher {
  doCommand: (command: ICommand) => void
  undoCommand: (command: ICommand) => void
}
