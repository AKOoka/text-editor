import { BaseCommand } from './BaseCommand'
import { ITextEditor } from '../../core/ITextEditor'
import { TextEditorResponse } from '../../common/TextEditorResponse'

class SetTextCursorPosition extends BaseCommand {
  private _x: number
  private _y: number

  constructor (toBeSaved: boolean, x: number, y: number) {
    super(toBeSaved)
    this._x = x
    this._y = y
  }

  do (context: ITextEditor): void {
    const res: TextEditorResponse = context.fetchData('text-cursor-position')
    context.setTextCursorXPosition(this._x)
    context.setTextCursorYPosition(this._y)
    this._x = res.getTextCursorX()
    this._y = res.getTextCursorY()
    context.updateTextCursorPosition()
  }

  undo (context: ITextEditor): void {
    const res: TextEditorResponse = context.fetchData('text-cursor-position')
    context.setTextCursorXPosition(this._x)
    context.setTextCursorYPosition(this._y)
    this._x = res.getTextCursorX()
    this._y = res.getTextCursorY()
    context.updateTextCursorPosition()
  }
}

export { SetTextCursorPosition }
