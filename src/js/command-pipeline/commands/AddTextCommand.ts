import { ICommand } from '../ICommand'
import { ITextEditor } from '../../core/ITextEditor'

class AddTextCommand implements ICommand {
  private readonly _text: string
  private readonly _toBeSaved: boolean

  constructor (text: string, toBeSaved: boolean) {
    this._text = text
    this._toBeSaved = toBeSaved
  }

  toBeSaved (): boolean {
    return this._toBeSaved
  }

  do (context: ITextEditor): void {
    context.addText(this._text)
    context.horMoveTextCursor(this._text.length)
    context.updateTextRepresentation()
    context.updateTextCursor()
  }

  undo (context: ITextEditor): void {
    context.horMoveTextCursor(-this._text.length)
    context.deleteTextOnTextCursor(this._text.length)
    context.updateTextRepresentation()
    context.updateTextCursor()
  }
}

export { AddTextCommand }
