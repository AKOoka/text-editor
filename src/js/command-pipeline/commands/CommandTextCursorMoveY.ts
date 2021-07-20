import { ITextEditor } from '../../core/ITextEditor'
import { BaseCommand } from './BaseCommand'

class CommandTextCursorMoveY extends BaseCommand {
  private readonly _offset: number

  constructor (toBeSaved: boolean, offset: number) {
    super(toBeSaved)
    this._offset = offset
  }

  private _isValidY (y: number, linesCount: number): boolean {
    return y >= 0 && y < linesCount
  }

  do (context: ITextEditor): void {
    const linesCount = context.getLinesCount()
    const y = context.getTextCursorY()
    const newY = y + this._offset

    if (!this._isValidY(newY, linesCount)) {
      return
    }

    context.setTextCursorY(newY)
    context.updateTextCursorPoint()
  }

  undo (context: ITextEditor): void {
    context.updateTextCursorPoint()
  }
}

export { CommandTextCursorMoveY }
