import { BaseCommand } from './commands/BaseCommand'
import { TextEditorResponse } from '../common/TextEditorResponse'
import { TextEditorRequestType } from '../common/TextEditorRequestType'

export interface ICommandDispatcher {
  doCommand: (command: BaseCommand) => void
  undoCommand: () => void
  redoCommand: () => void
  fetchData: (request: TextEditorRequestType) => TextEditorResponse
}
