import { ITextEditor } from '../../core/ITextEditor'
import { IRange } from '../../common/IRange'
import { BaseCommand } from './BaseCommand'

class AddSelectionCommand extends BaseCommand {
  private readonly _range: IRange

  constructor (range: IRange, toBeSaved: boolean) {
    super(toBeSaved)
    this._range = range
  }

  do (context: ITextEditor): void {
    context.addSelection(this._range)
    context.updateTextCursor()
  }

  undo (context: ITextEditor): void {
    context.addSelection(this._range)
    context.updateTextCursor()
  }
}

export { AddSelectionCommand }
