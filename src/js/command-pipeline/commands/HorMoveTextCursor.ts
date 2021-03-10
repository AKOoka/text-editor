import { ITextEditor } from '../../core/ITextEditor'
import { ICommand } from '../ICommand'

class HorMoveTextCursor implements ICommand {
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
    context.horMoveTextCursor(this._offset)
    context.updateTextCursor()
  }

  undo (context: ITextEditor): void {
    context.horMoveTextCursor(-this._offset)
    context.updateTextCursor()
  }
}

export { HorMoveTextCursor }
