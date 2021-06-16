import { ITextEditor } from '../../core/ITextEditor'
import { Selection } from '../../common/Selection'
import { BaseCommand } from './BaseCommand'

export class CommandSelectionDeleteLast extends BaseCommand {
  private _deletedSelection: Selection

  do (context: ITextEditor): void {
    const selections = context.getTextCursorSelections()
    this._deletedSelection = selections[selections.length - 1]
    context.deleteConcreteTextCursorSelection(selections.length - 1)
    context.updateTextCursorSelections()
  }

  undo (context: ITextEditor): void {
    context.addTextCursorSelections([this._deletedSelection])
    context.updateTextCursorSelections()
  }
}
