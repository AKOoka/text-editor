import { ITextEditor } from '../../core/ITextEditor'
import { BaseCommand } from './BaseCommand'
import { Selection } from '../../common/Selection'

export class CommandTextStyleDeleteAll extends BaseCommand {
  private _selections: Selection[]

  constructor (toBeSaved: boolean) {
    super(toBeSaved)
    this._selections = []
  }

  do (context: ITextEditor): void {
    this._selections = context.getTextCursorSelections()
    context.deleteAllTextStylesInSelections(this._selections)
    context.deleteAllTextCursorSelections()
    context.updateTextRepresentation()
    context.updateTextCursorSelections()
  }

  undo (context: ITextEditor): void {
    context.addTextCursorSelections(this._selections)
    context.updateTextRepresentation()
    context.updateTextCursorSelections()
  }
}
