import { ITextEditor } from '../../core/ITextEditor'
import { BaseCommand } from './BaseCommand'
import { IPoint } from '../../common/IPoint'

class CommandTextCursorMoveX extends BaseCommand {
  private readonly _offset: number

  constructor (toBeSaved: boolean, offset: number) {
    super(toBeSaved)
    this._offset = offset
  }

  _getNewX (context: ITextEditor, offset: number): IPoint {
    const { x, y } = context.getTextCursorPosition()
    const textLength = context.getLineLength(y)
    const textLineCount = context.getLinesCount()
    const newX: number = x + offset

    if (newX < 0) {
      if (y - 1 >= 0) {
        const textLength = context.getLineLength(y - 1)
        return { x: textLength, y: y - 1 }
      } else {
        return { x: 0, y }
      }
    } else if (newX > textLength) {
      return (offset > 0 && y + 1 < textLineCount) ? { x: 0, y: y + 1 } : { x: textLength + offset, y }
    }

    return { x: newX, y }
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
