import { ITextEditor } from '../../core/ITextEditor'
import { BaseCommand } from './BaseCommand'
import { TextEditorRequest } from '../../common/TextEditorRequest'
import { Range } from '../../common/Range'
import { TextEditorRequestPayload } from '../../common/TextEditorRequestPayload'
import { NodeRepresentation } from '../../core/TextRepresentation/NodeRepresentation'

class CommandLineAdd extends BaseCommand {
  private readonly _count: number
  private _content: NodeRepresentation[]

  constructor (count: number, toBeSaved: boolean) {
    super(toBeSaved)
    this._count = count
  }

  do (context: ITextEditor): void {
    const { x, y } = context.fetchData([new TextEditorRequest('textCursorPosition')]).textCursorPosition
    const { textLength } = context.fetchData([TextEditorRequest.NewWithPayload('textLength', TextEditorRequestPayload.NewWithY(y))])

    this._content = context.fetchData([
      TextEditorRequest.NewWithPayload(
        'selectedContent',
        TextEditorRequestPayload.NewWithSelections([{ rangeX: new Range(x, textLength), rangeY: new Range(y, y) }])
      )
    ]).selectedContent
    context.deleteTextInRange(y, new Range(x, textLength))
    context.addNewLinesInRange(new Range(y, y + this._count))
    context.addContent({ x: 0, y: y + this._count }, this._content)
    context.setTextCursorPosition({ x: 0, y: y + this._count })
    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }

  undo (context: ITextEditor): void {
    const { textCursorY } = context.fetchData([new TextEditorRequest('textCursorY')])
    const { textLength } = context.fetchData([TextEditorRequest.NewWithPayload('textLength', TextEditorRequestPayload.NewWithY(textCursorY))])
    context.deleteLinesInRange(new Range(textCursorY - this._count, textCursorY))
    context.addContent({ x: textLength, y: textCursorY - this._count }, this._content)
    context.setTextCursorPosition({ x: textLength, y: textCursorY - this._count })
    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }
}

export { CommandLineAdd }
