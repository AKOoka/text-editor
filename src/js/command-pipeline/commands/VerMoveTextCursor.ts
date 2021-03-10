import { ITextEditor } from '../../core/ITextEditor'
import { ICommand } from '../ICommand'

class VerMoveTextCursor implements ICommand {
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
    context.verMoveTextCursor(this._offset)
    context.updateTextCursor()
  }

  undo (context: ITextEditor): void {
    context.verMoveTextCursor(-this._offset)
    context.updateTextCursor()
  }
}

export { VerMoveTextCursor }
