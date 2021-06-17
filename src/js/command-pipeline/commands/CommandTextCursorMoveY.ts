import { Point } from '../../common/Point'
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

  private _getValidX (x: number, lineSize: number): number {
    if (x < 0) {
      return 0
    } else if (x > lineSize) {
      return lineSize
    } else {
      return x
    }
  }

  do (context: ITextEditor): void {
    const linesCount = context.getLinesCount()
    const y = context.getTextCursorY()
    let x: number
    const newY = y + this._offset

    if (!this._isValidY(newY, linesCount)) {
      return
    }

    if (context.getTextCursorIsLastUpdateY()) {
      x = context.getTextCursorSavedX()
    } else {
      x = context.getTextCursorX()
      context.saveTextCursorX()
      context.setTextCursorIsLastUpdateY(true)
    }

    context.setTextCursorPoint(new Point(this._getValidX(x, context.getLineSize(newY)), newY))
    context.updateTextCursorPoint()
  }

  undo (context: ITextEditor): void {
    context.updateTextCursorPoint()
  }
}

export { CommandTextCursorMoveY }
