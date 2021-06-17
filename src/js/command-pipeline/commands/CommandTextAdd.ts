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
    context.addText(context.getTextCursorPoint(), this._text)
    context.updateTextRepresentation()
  }

  undo (context: ITextEditor): void {
    const { x, y } = context.getTextCursorPoint()

    context.deleteTextInRange(y, new Range(x - this._text.length, x))
    context.updateTextRepresentation()
  }
}

export { CommandTextAdd }
