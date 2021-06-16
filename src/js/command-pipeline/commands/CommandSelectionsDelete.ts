import { ITextEditor } from '../../core/ITextEditor'
import { BaseCommand } from './BaseCommand'
import { Selection } from '../../common/Selection'

export class CommandSelectionsDelete extends BaseCommand {
  private _selections: Selection[]

  do (context: ITextEditor): void {
    this._selections = context.getTextCursorSelections()
    context.deleteAllTextCursorSelections()
    context.updateTextCursorSelections()
  }

  undo (context: ITextEditor): void {
    context.addTextCursorSelections(this._selections)
    context.updateTextCursorSelections()
  }
}
