import { BaseCommand } from './BaseCommand'
import { ITextEditor } from '../../core/ITextEditor'
import { NodeRepresentation } from '../../core/TextRepresentation/NodeRepresentation'
import { TextEditorRequest } from '../../common/TextEditorRequest'
import { Range } from '../../common/Range'

class CommandContentPaste extends BaseCommand {
  private readonly _content: NodeRepresentation[]

  constructor (toBeSaved: true, content: NodeRepresentation[]) {
    super(toBeSaved)
    this._content = content
  }

  do (context: ITextEditor): void {
    const { textCursorPosition } = context.fetchData([new TextEditorRequest('textCursorPosition')])
    context.addContent(textCursorPosition, this._content)
    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }

  undo (context: ITextEditor): void {
    const { x, y } = context.fetchData([new TextEditorRequest('textCursorPosition')]).textCursorPosition
    let contentSize: number = 0
    for (const c of this._content) {
      contentSize += c.size
    }
    context.deleteTextInRange(y, new Range(x - contentSize, x))
    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }
}

export { CommandContentPaste }
