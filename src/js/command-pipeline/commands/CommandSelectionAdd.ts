import { ITextEditor } from '../../core/ITextEditor'
import { BaseCommand } from './BaseCommand'
import { ISelection } from '../../common/ISelection'

class CommandSelectionAdd extends BaseCommand {
  private readonly _selection: ISelection

  constructor (selection: ISelection, toBeSaved: boolean) {
    super(toBeSaved)
    this._selection = selection
  }

  do (context: ITextEditor): void {
    context.addTextCursorSelections([this._selection])
    context.updateTextCursorSelections()
  }

  undo (context: ITextEditor): void {
    context.deleteTextCursorSelections()
    context.updateTextCursorSelections()
  }
}

export { CommandSelectionAdd }
