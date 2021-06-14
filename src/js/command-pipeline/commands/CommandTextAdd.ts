import { ITextEditor } from '../../core/ITextEditor'
import { BaseCommand } from './BaseCommand'
import { Range } from '../../common/Range'
import { IPoint } from '../../common/IPoint'

class CommandTextAdd extends BaseCommand {
  private readonly _text: string
  private _position: IPoint

  constructor (text: string, toBeSaved: boolean) {
    super(toBeSaved)
    this._text = text
  }

  _getValidX (context: ITextEditor, position: IPoint): number {
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

    this._position = { x: validX, y: position.y }

    context.addText(this._position, this._text)
    context.setTextCursorX(validX + this._text.length)

    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }

  undo (context: ITextEditor): void {
    const { x, y } = this._position
    const xBeforeAdd = x - this._text.length

    context.setTextCursorPosition({ x: xBeforeAdd, y })
    context.deleteTextInRange(this._position.y, new Range(xBeforeAdd, x))

    this._position = context.getTextCursorPosition()

    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }
}

export { CommandTextAdd }
