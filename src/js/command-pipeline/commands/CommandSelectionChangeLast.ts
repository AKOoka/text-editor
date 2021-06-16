import { ITextEditor } from '../../core/ITextEditor'
import { Selection } from '../../common/Selection'
import { BaseCommand } from './BaseCommand'

export class CommandSelectionChangeLast extends BaseCommand {
  private readonly _selection: Selection
  private _previousSelection: Selection

  constructor (selection: Selection, toBeSaved: boolean) {
    super(toBeSaved)
    this._selection = selection
  }

  do (context: ITextEditor): void {
    const selections = context.getTextCursorSelections()
    this._previousSelection = selections[selections.length - 1]
    context.changeTextCursorSelection(selections.length - 1, this._selection)
    context.updateTextCursorSelections()
  }

  undo (context: ITextEditor): void {
    const selections = context.getTextCursorSelections()
    context.changeTextCursorSelection(selections.length - 1, this._previousSelection)
    context.updateTextCursorSelections()
  }
}
