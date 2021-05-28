import { ITextEditor } from '../../core/ITextEditor'
import { BaseCommand } from './BaseCommand'
import { TextEditorRequest } from '../../common/TextEditorRequest'
import { TextEditorRequestPayload } from '../../common/TextEditorRequestPayload'
import { Range } from '../../common/Range'
import { NodeRepresentation } from '../../core/TextRepresentation/NodeRepresentation'

class CommandTextDelete extends BaseCommand {
  private readonly _leftOffset: number
  private readonly _rightOffset: number
  private _deletedContent: NodeRepresentation[]
  // private _lineDeleted: boolean

  constructor (toBeSaved: boolean, leftOffset: number, rightOffset: number) {
    super(toBeSaved)
    this._leftOffset = leftOffset
    this._rightOffset = rightOffset
  }

  do (context: ITextEditor): void {
    const { x, y } = context.fetchData([new TextEditorRequest('textCursorPosition')]).textCursorPosition
    const { textLength, textLineCount, selectedContent } = context.fetchData([
      TextEditorRequest.NewWithPayload('textLength', TextEditorRequestPayload.NewWithY(y)),
      new TextEditorRequest('textLineCount'),
      TextEditorRequest.NewWithPayload('selectedContent', TextEditorRequestPayload.NewWithSelections([
        { rangeX: new Range(x + this._leftOffset, x + this._rightOffset), rangeY: new Range(y, y) }
      ]))
    ])
    this._deletedContent = selectedContent
    if (textLength === 0) {
      if (textLineCount === 1) {
        return
      }

      context.deleteLinesInRange(new Range(y, y + 1 <= textLineCount ? y + 1 : textLineCount))
      if (this._leftOffset < 0) {
        const newTextLength: number = context.fetchData([
          TextEditorRequest.NewWithPayload('textLength', TextEditorRequestPayload.NewWithY(y + this._leftOffset))
        ]).textLength
        context.setTextCursorPosition({ x: newTextLength, y: y + this._leftOffset })
      }
    } else {
      context.deleteTextInRange(y, new Range(x + this._leftOffset, x + this._rightOffset))
      context.setTextCursorX(x + this._leftOffset)
    }
    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }

  undo (context: ITextEditor): void {
    const { x, y } = context.fetchData([new TextEditorRequest('textCursorPosition')]).textCursorPosition
    context.addContent({ x, y }, this._deletedContent)
    context.setTextCursorX(x - this._leftOffset)
    // if (this._lineDeleted) {}
    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }
}

export { CommandTextDelete }
