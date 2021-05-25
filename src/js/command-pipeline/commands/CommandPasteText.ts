import { BaseCommand } from './BaseCommand'
import { ITextEditor } from '../../core/ITextEditor'

class CommandPasteText extends BaseCommand {
  private readonly _text: string

  constructor (toBeSaved: true, text: string) {
    super(toBeSaved)
    this._text = text
  }

  do (context: ITextEditor): void {
    context.addText(this._text)
    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }

  undo (context: ITextEditor): void {
    context.deleteTextOnTextCursor(this._text.length)
    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }
}

export { CommandPasteText }
