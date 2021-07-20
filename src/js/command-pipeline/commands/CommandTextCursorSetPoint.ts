import { BaseCommand } from './BaseCommand'
import { ITextEditor } from '../../core/ITextEditor'
import { Point } from '../../common/Point'

export class CommandTextCursorSetPoint extends BaseCommand {
  private _point: Point

  constructor (toBeSaved: boolean, point: Point) {
    super(toBeSaved)
    this._point = point
  }

  do (context: ITextEditor): void {
    const textCursorPosition = context.getTextCursorPoint()
    context.setTextCursorPoint(this._point)
    this._point = textCursorPosition
    context.updateTextCursorPoint()
  }

  undo (context: ITextEditor): void {
    const textCursorPosition = context.getTextCursorPoint()
    context.setTextCursorPoint(this._point)
    this._point = textCursorPosition
    context.updateTextCursorPoint()
  }
}
