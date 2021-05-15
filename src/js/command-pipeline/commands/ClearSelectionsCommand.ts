import { ITextEditor } from '../../core/ITextEditor'
import { BaseCommand } from './BaseCommand'

class ClearSelectionsCommand extends BaseCommand {
  do (context: ITextEditor): void {
    context.clearSelections()
    context.updateTextCursor()
  }

  undo (context: ITextEditor): void {
    context.clearSelections()
    context.updateTextCursor()
  }
}

export { ClearSelectionsCommand }
