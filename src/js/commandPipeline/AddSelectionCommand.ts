import { ICommand } from './ICommand'
import { ITextEditor } from '../core/ITextEditor'
import { IRange } from '../common/IRange'

class AddSelectionCommand implements ICommand {
  private readonly _range: IRange
  private readonly _toBeSaved: boolean

  constructor (range: IRange, toBeSaved: boolean) {
    this._range = range
    this._toBeSaved = toBeSaved
  }

  toBeSaved (): boolean {
    return this._toBeSaved
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
