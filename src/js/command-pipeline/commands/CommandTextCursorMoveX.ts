import { ITextEditor } from '../../core/ITextEditor'
import { BaseCommand } from './BaseCommand'
import { Point } from '../../common/Point'

class CommandTextCursorMoveX extends BaseCommand {
  private readonly _offset: number

  constructor (toBeSaved: boolean, offset: number) {
    super(toBeSaved)
    this._offset = offset
  }

  _getNewPoint (context: ITextEditor, offset: number): Point {
    const textCursorPosition = context.getTextCursorPoint()
    const { x, y } = textCursorPosition
    const lineSize = context.getLineSize(y)
    const linesCount = context.getLinesCount()
    let newX: number = x + offset
    let newY: number = y

    if (newX < 0) {
      if (y - 1 >= 0) {
        newY = y - 1
        newX = context.getLineSize(newY)
      } else {
        newX = 0
      }
    } else if (newX > lineSize) {
      if (y + 1 < linesCount) {
        newY = y + 1
        newX = 0
      } else {
        newX = lineSize
      }
    }

    return textCursorPosition.reset(newX, newY)
  }

  do (context: ITextEditor): void {
    context.setTextCursorPoint(this._getNewPoint(context, this._offset))
    context.updateTextCursorPoint()
  }

  undo (context: ITextEditor): void {
    context.setTextCursorPoint(this._getNewPoint(context, -this._offset))
    context.updateTextCursorPoint()
  }
}

export { CommandTextCursorMoveX }
