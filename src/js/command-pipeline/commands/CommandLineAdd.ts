import { ITextEditor } from '../../core/ITextEditor'
import { BaseCommand } from './BaseCommand'
import { Range } from '../../common/Range'
import { INodeCopy } from '../../core/TextRepresentation/Nodes/INode'

class CommandLineAdd extends BaseCommand {
  private readonly _count: number
  private _content: INodeCopy[]

  constructor (count: number, toBeSaved: boolean) {
    super(toBeSaved)
    this._count = count
  }

  do (context: ITextEditor): void {
    const { x, y } = context.getTextCursorPosition()
    const textLength = context.getLineLength(y)

    context.addNewLinesInRange(new Range(y + 1, y + 1 + this._count))

    if (x < textLength) {
      this._content = context.getContentInSelections([{ rangeX: new Range(x, textLength), rangeY: new Range(y, y) }])
      context.deleteTextInRange(y, new Range(x, textLength))
      context.addContent({ x: 0, y: y + this._count }, this._content)
    }

    context.setTextCursorPosition({ x: 0, y: y + this._count })
    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }

  undo (context: ITextEditor): void {
    const textCursorY = context.getTextCursorY()
    const textLength = context.getLineLength(textCursorY)

    context.deleteLinesInRange(new Range(textCursorY - this._count, textCursorY))

    if (this._content !== null) {
      context.addContent({ x: textLength, y: textCursorY - this._count }, this._content)
    }

    context.setTextCursorPosition({ x: textLength, y: textCursorY - this._count })
    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }
}

export { CommandLineAdd }
