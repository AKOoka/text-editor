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
    context.horizontalMoveTextCursor(this._text.length)
    context.updateTextRepresentation()
    context.updateTextCursor()
  }

  undo (context: ITextEditor): void {
    context.horizontalMoveTextCursor(-this._text.length)
    context.deleteTextOnTextCursor(this._text.length)
    context.updateTextRepresentation()
    context.updateTextCursor()
  }
}

export { AddTextCommand }
