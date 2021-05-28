import { ITextEditor } from '../../core/ITextEditor'
import { BaseCommand } from './BaseCommand'
import { TextEditorRequest } from '../../common/TextEditorRequest'

class CommandTextCursorMoveY extends BaseCommand {
  private readonly _offset: number

  constructor (toBeSaved: boolean, offset: number) {
    super(toBeSaved)
    this._offset = offset
  }

  _getNewY (context: ITextEditor, offset: number): number {
    const { textCursorY } = context.fetchData([new TextEditorRequest('textCursorY')])
    const { textLineCount } = context.fetchData([new TextEditorRequest('textLineCount')])
    const newY: number = textCursorY + offset
    if (newY < 0) {
      return 0
    } else if (newY >= textLineCount) {
      return textLineCount - 1
    }

    return newY
  }

  do (context: ITextEditor): void {
    context.setTextCursorY(this._getNewY(context, this._offset))
    context.updateTextCursorPosition()
  }

  undo (context: ITextEditor): void {
    context.setTextCursorY(this._getNewY(context, -this._offset))
    context.updateTextCursorPosition()
  }
}

export { CommandTextCursorMoveY }
