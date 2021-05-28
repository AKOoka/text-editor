import { BaseCommand } from './commands/BaseCommand'
import { TextEditorResponse } from '../common/TextEditorResponse'
import { TextEditorRequest } from '../common/TextEditorRequest'

export interface ICommandDispatcher {
  doCommand: (command: BaseCommand) => void
  undoCommand: () => void
  redoCommand: () => void
  fetchData: (requests: TextEditorRequest[]) => TextEditorResponse
}
