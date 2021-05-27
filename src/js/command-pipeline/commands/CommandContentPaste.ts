import { BaseCommand } from './BaseCommand'
import { ITextEditor } from '../../core/ITextEditor'
import { NodeRepresentation } from '../../core/TextRepresentation/NodeRepresentation'

class CommandContentPaste extends BaseCommand {
  private readonly _content: NodeRepresentation[]

  constructor (toBeSaved: true, content: NodeRepresentation[]) {
    super(toBeSaved)
    this._content = content
  }

  do (context: ITextEditor): void {
    console.log(this._content)
    context.addContent({ x: 0, y: 0 }, this._content)
    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }

  undo (context: ITextEditor): void {
    // context.deleteTextOnTextCursor(this._content.length)
    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }
}

export { CommandContentPaste }
