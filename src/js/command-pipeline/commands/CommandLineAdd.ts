import { ITextEditor } from '../../core/ITextEditor'
import { BaseCommand } from './BaseCommand'
import { Range } from '../../common/Range'
// import { INodeCopy } from '../../core/TextRepresentation/Nodes/INode'
// import { Selection } from '../../common/Selection'
// import { Point } from '../../common/Point'

class CommandLineAdd extends BaseCommand {
  private readonly _count: number
  // private _content: INodeCopy[]

  constructor (count: number, toBeSaved: boolean) {
    super(toBeSaved)
    this._count = count
  }

  do (context: ITextEditor): void {
    const textCursorPoint = context.getTextCursorPoint()
    const { y } = textCursorPoint
    // const { x, y } = textCursorPoint
    // const textLength = context.getLineSize(y)

    context.addNewLinesInRange(new Range(y + 1, y + 1 + this._count))

    // if (x < textLength) {
    //   this._content = context.getContentInSelections([new Selection(new Range(x, textLength), new Range(y, y))])
    //   context.deleteTextInRange(y, new Range(x, textLength))
    //   context.addContent(textCursorPoint.reset(0, y + this._count), this._content)
    // }

    // context.setTextCursorPoint(textCursorPoint.reset(0, y + this._count))
    context.updateTextRepresentation()
  }

  undo (context: ITextEditor): void {
    const textCursorY = context.getTextCursorY()
    // const textLength = context.getLineSize(textCursorY)

    context.deleteLinesInRange(new Range(textCursorY - this._count, textCursorY))

    // if (this._content !== null) {
    //   context.addContent(new Point(textLength, textCursorY - this._count), this._content)
    // }

    // context.setTextCursorPoint(new Point(textLength, textCursorY - this._count))
    context.updateTextRepresentation()
  }
}

export { CommandLineAdd }
