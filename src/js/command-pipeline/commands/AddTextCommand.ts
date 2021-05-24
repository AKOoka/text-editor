import { ITextEditor } from '../../core/ITextEditor'
import { BaseCommand } from './BaseCommand'

class AddTextCommand extends BaseCommand {
  private readonly _text: string

  constructor (text: string, toBeSaved: boolean) {
    super(toBeSaved)
    this._text = text
  }

  do (context: ITextEditor): void {
    context.addText(this._text)
    context.moveTextCursorXPosition(this._text.length)
    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }

  undo (context: ITextEditor): void {
    context.moveTextCursorXPosition(-this._text.length)
    context.deleteTextOnTextCursor(this._text.length)
    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }
}

export { AddTextCommand }
