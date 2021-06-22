import { ITextEditor } from '../../core/ITextEditor'
import { BaseCommand } from './BaseCommand'
import { Range } from '../../common/Range'
import { CommandTextCursorMoveX } from './CommandTextCursorMoveX'

class CommandTextAdd extends BaseCommand {
  private readonly _text: string
  private readonly _commandMoveTextCursorX: CommandTextCursorMoveX

  constructor (text: string, toBeSaved: boolean) {
    super(toBeSaved)
    this._text = text
    this._commandMoveTextCursorX = new CommandTextCursorMoveX(false, text.length)
  }

  do (context: ITextEditor): void {
    context.addText(context.getTextCursorPoint(), this._text)
    context.updateTextRepresentation()
    this._commandMoveTextCursorX.do(context)
  }

  undo (context: ITextEditor): void {
    const { x, y } = context.getTextCursorPoint()

    context.deleteTextInRange(y, new Range(x - this._text.length, x))
    context.updateTextRepresentation()
    this._commandMoveTextCursorX.undo(context)
  }
}

export { CommandTextAdd }
