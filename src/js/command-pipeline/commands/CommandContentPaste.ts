import { BaseCommand } from './BaseCommand'
import { ITextEditor } from '../../core/ITextEditor'
import { Range } from '../../common/Range'
import { ILineContent } from '../../core/TextRepresentation/ILineContent'

class CommandContentPaste extends BaseCommand {
  private readonly _content: ILineContent[]

  constructor (toBeSaved: true, content: ILineContent[]) {
    super(toBeSaved)
    this._content = content
  }

  do (context: ITextEditor): void {
    const textCursorPosition = context.getTextCursorPoint()

    context.addContent(textCursorPosition, this._content)
    context.updateTextRepresentation()
    context.updateTextCursorPoint()
  }

  undo (context: ITextEditor): void {
    const { x, y } = context.getTextCursorPoint()

    context.deleteTextInRange(
      y,
      new Range(
        x - this._content.reduce((p, c) => p + c.getSize(), 0),
        x
      )
    )
    context.updateTextRepresentation()
    context.updateTextCursorPoint()
  }
}

export { CommandContentPaste }
