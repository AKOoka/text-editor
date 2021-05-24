import { ITextEditor } from '../../core/ITextEditor'
import { BaseCommand } from './BaseCommand'
import { IRange } from '../../common/IRange'

class ClearSelectionsCommand extends BaseCommand {
  private _selections: IRange[]

  do (context: ITextEditor): void {
    this._selections = context.clearSelections()
    context.updateTextCursorSelections()
  }

  undo (context: ITextEditor): void {
    context.addSelections(this._selections)
    context.updateTextCursorSelections()
  }
}

export { ClearSelectionsCommand }
