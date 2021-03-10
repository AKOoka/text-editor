import { ITextEditor } from '../../core/ITextEditor'
import { ICommand } from '../ICommand'

class DeleteTextCommand implements ICommand {
  private readonly _toBeSaved: boolean
  private readonly _offset: number

  constructor (toBeSaved: boolean, offset: number) {
    this._toBeSaved = toBeSaved
    this._offset = offset
  }

  toBeSaved (): boolean {
    return this._toBeSaved
  }

  do (context: ITextEditor): void {
    context.deleteTextOnTextCursor(this._offset)
    context.deleteTextOnSelection()
    context.updateTextRepresentation()
    context.updateTextCursor()
  }

  undo (context: ITextEditor): void {
    console.log(context)
  }
}

export { DeleteTextCommand }
