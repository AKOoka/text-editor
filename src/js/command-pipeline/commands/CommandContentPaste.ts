import { BaseCommand } from './BaseCommand'
import { ITextEditor } from '../../core/ITextEditor'
import { Range } from '../../common/Range'
import { INodeCopy } from '../../core/TextRepresentation/Nodes/INode'

class CommandContentPaste extends BaseCommand {
  private readonly _content: INodeCopy[]

  constructor (toBeSaved: true, content: INodeCopy[]) {
    super(toBeSaved)
    this._content = content
  }

  do (context: ITextEditor): void {
    const textCursorPosition = context.getTextCursorPosition()

    context.addContent(textCursorPosition, this._content)
    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }

  undo (context: ITextEditor): void {
    const { x, y } = context.getTextCursorPosition()

    context.deleteTextInRange(
      y,
      new Range(
        x - this._content.reduce((p, c) => p + c.size, 0),
        x
      )
    )
    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }
}

export { CommandContentPaste }
