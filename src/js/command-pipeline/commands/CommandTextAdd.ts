import { ITextEditor } from '../../core/ITextEditor'
import { BaseCommand } from './BaseCommand'
import { Range } from '../../common/Range'

class CommandTextAdd extends BaseCommand {
  private readonly _text: string

  constructor (text: string, toBeSaved: boolean) {
    super(toBeSaved)
    this._text = text
  }

  do (context: ITextEditor): void {
    const position = context.getTextCursorPosition()
    context.addText(position, this._text)
    context.setTextCursorX(position.x + this._text.length)
    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }

  undo (context: ITextEditor): void {
    const position = context.getTextCursorPosition()
    context.setTextCursorX(position.x - this._text.length)
    context.deleteTextInRange(position.y, new Range(position.x - this._text.length, position.x))
    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }
}

export { CommandTextAdd }
