import { BaseCommand } from './BaseCommand'
import { ITextEditor } from '../../core/ITextEditor'
import { IPoint } from '../../common/IPoint'

class CommandTextCursorSetPosition extends BaseCommand {
  private _point: IPoint

  constructor (toBeSaved: boolean, point: IPoint) {
    super(toBeSaved)
    this._point = point
  }

  _getNewPosition (context: ITextEditor, position: IPoint): IPoint {
    const textCursorY = context.getTextCursorY()
    const textLineCount = context.getLinesCount()
    const textLength = context.getLineLength(textCursorY)
    let newX: number = 0
    let newY: number = 0

    if (position.x < 0) {
      newX = 0
    } else if (position.x > textLength) {
      newX = textLength
    } else {
      newX = position.x
    }

    if (position.y < 0) {
      newY = 0
    } else if (position.y >= textLineCount) {
      newY = textLineCount - 1
    } else {
      newY = position.y
    }

    return { x: newX, y: newY }
  }

  do (context: ITextEditor): void {
    const textCursorPosition = context.getTextCursorPosition()
    context.setTextCursorPosition(this._getNewPosition(context, this._point))
    this._point = textCursorPosition
    context.updateTextCursorPosition()
  }

  undo (context: ITextEditor): void {
    const textCursorPosition = context.getTextCursorPosition()
    context.setTextCursorPosition(this._getNewPosition(context, this._point))
    this._point = textCursorPosition
    context.updateTextCursorPosition()
  }
}

export { CommandTextCursorSetPosition }