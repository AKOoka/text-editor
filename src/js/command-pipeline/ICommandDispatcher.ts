import { BaseCommand } from './commands/BaseCommand'
import { RequestType } from '../common/RequestType'
import { TextEditorResponse } from '../common/TextEditorResponse'

export interface ICommandDispatcher {
  doCommand: (command: BaseCommand) => void
  undoCommand: () => void
  redoCommand: () => void
  fetchData: (request: RequestType) => TextEditorResponse
}
