import { ICommand } from './ICommand'
import { ITextEditor } from '../core/ITextEditor'

class ClearSelectionsCommand implements ICommand {
  private readonly _toBeSaved: boolean

  constructor (toBeSaved: boolean) {
    this._toBeSaved = toBeSaved
  }

  toBeSaved (): boolean {
    return this._toBeSaved
  }

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
