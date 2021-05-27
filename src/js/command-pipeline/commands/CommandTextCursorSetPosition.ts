import { BaseCommand } from './BaseCommand'
import { ITextEditor } from '../../core/ITextEditor'
import { TextEditorResponse } from '../../common/TextEditorResponse'
import { IPoint } from '../../common/IPoint'

class CommandTextCursorSetPosition extends BaseCommand {
  private _point: IPoint

  constructor (toBeSaved: boolean, point: IPoint) {
    super(toBeSaved)
    this._point = point
  }

  do (context: ITextEditor): void {
    const res: TextEditorResponse = context.fetchData('textCursorPosition')
    context.setTextCursorPosition(this._point)
    this._point = res.textCursorPosition
    context.updateTextCursorPosition()
  }

  undo (context: ITextEditor): void {
    const res: TextEditorResponse = context.fetchData('textCursorPosition')
    context.setTextCursorPosition(this._point)
    this._point = res.textCursorPosition
    context.updateTextCursorPosition()
  }
}

export { CommandTextCursorSetPosition }
