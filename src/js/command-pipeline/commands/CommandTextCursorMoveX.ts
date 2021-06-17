import { ITextEditor } from '../../core/ITextEditor'
import { BaseCommand } from './BaseCommand'
import { Point } from '../../common/Point'

class CommandTextCursorMoveX extends BaseCommand {
  private readonly _offset: number

  constructor (toBeSaved: boolean, offset: number) {
    super(toBeSaved)
    this._offset = offset
  }

  _getNewX (context: ITextEditor, offset: number): Point {
    const textCursorPosition = context.getTextCursorPosition()
    const { x, y } = textCursorPosition
    const textLength = context.getLineLength(y)
    const textLineCount = context.getLinesCount()
    const newX: number = x + offset

    if (newX < 0) {
      if (y - 1 >= 0) {
        const textLength = context.getLineLength(y - 1)
        return textCursorPosition.reset(textLength, y - 1)
      } else {
        return textCursorPosition.reset(0, y)
      }
    } else if (newX > textLength) {
      if (offset > 0 && y + 1 < textLineCount) {
        textCursorPosition.reset(0, y + 1)
      } else {
        textCursorPosition.reset(textLength + offset, y)
      }
    }

    return textCursorPosition.reset(newX, y)
  }

  do (context: ITextEditor): void {
    context.setTextCursorPosition(this._getNewX(context, this._offset))
    context.updateTextCursorPosition()
  }

  undo (context: ITextEditor): void {
    context.setTextCursorPosition(this._getNewX(context, -this._offset))
    context.updateTextCursorPosition()
  }
}

export { CommandTextCursorMoveX }
