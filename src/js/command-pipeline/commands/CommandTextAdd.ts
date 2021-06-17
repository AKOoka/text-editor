import { ITextEditor } from '../../core/ITextEditor'
import { BaseCommand } from './BaseCommand'
import { Range } from '../../common/Range'
import { Point } from '../../common/Point'

class CommandTextAdd extends BaseCommand {
  private readonly _text: string
  private _position: Point

  constructor (text: string, toBeSaved: boolean) {
    super(toBeSaved)
    this._text = text
  }

  _getValidX (context: ITextEditor, position: Point): number {
    const { x, y } = position
    const textLength = context.getLineLength(y)

    if (x < 0) {
      return 0
    } else if (x > textLength) {
      return textLength
    }

    return x
  }

  do (context: ITextEditor): void {
    const position = context.getTextCursorPosition()
    const validX = this._getValidX(context, position)

    this._position = position.reset(validX, position.y)

    context.addText(this._position, this._text)
    context.setTextCursorX(validX + this._text.length)

    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }

  undo (context: ITextEditor): void {
    const { x, y } = this._position
    const xBeforeAdd = x - this._text.length

    this._position.reset(xBeforeAdd, y)

    context.setTextCursorPosition(this._position)
    context.deleteTextInRange(this._position.y, new Range(xBeforeAdd, x))

    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }
}

export { CommandTextAdd }
