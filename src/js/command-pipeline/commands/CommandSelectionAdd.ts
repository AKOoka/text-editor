import { ITextEditor } from '../../core/ITextEditor'
import { BaseCommand } from './BaseCommand'
import { Selection } from '../../common/Selection'

class CommandSelectionAdd extends BaseCommand {
  private readonly _selection: Selection

  constructor (selection: Selection, toBeSaved: boolean) {
    super(toBeSaved)
    this._selection = selection
  }

  do (context: ITextEditor): void {
    context.addTextCursorSelections([this._selection])
    context.updateTextCursorSelections()
  }

  undo (context: ITextEditor): void {
    context.deleteAllTextCursorSelections()
    context.updateTextCursorSelections()
  }
}

export { CommandSelectionAdd }
