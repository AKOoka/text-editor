import { BaseCommand } from './BaseCommand'
import { ITextEditor } from '../../core/ITextEditor'
import { IPoint } from '../../common/IPoint'
import { TextEditorRequest } from '../../common/TextEditorRequest'
import { TextEditorRequestPayload } from '../../common/TextEditorRequestPayload'

class CommandTextCursorSetPosition extends BaseCommand {
  private _point: IPoint

  constructor (toBeSaved: boolean, point: IPoint) {
    super(toBeSaved)
    this._point = point
  }

  _getNewPosition (context: ITextEditor, position: IPoint): IPoint {
    const { textCursorY } = context.fetchData([new TextEditorRequest('textCursorY')])
    const { textLineCount, textLength } = context.fetchData([
      new TextEditorRequest('textLineCount'),
      TextEditorRequest.NewWithPayload('textLength', TextEditorRequestPayload.NewWithY(textCursorY))
    ])
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
    const { textCursorPosition } = context.fetchData([new TextEditorRequest('textCursorPosition')])
    context.setTextCursorPosition(this._getNewPosition(context, this._point))
    this._point = textCursorPosition
    context.updateTextCursorPosition()
  }

  undo (context: ITextEditor): void {
    const { textCursorPosition } = context.fetchData([new TextEditorRequest('textCursorPosition')])
    context.setTextCursorPosition(this._getNewPosition(context, this._point))
    this._point = textCursorPosition
    context.updateTextCursorPosition()
  }
}

export { CommandTextCursorSetPosition }
