import { ITextEditor } from '../../core/ITextEditor'
import { TextStyleType } from '../../common/TextStyleType'
import { BaseCommand } from './BaseCommand'
import { ISelection } from '../../common/ISelection'
import { TextEditorRequest } from '../../common/TextEditorRequest'

class CommandTextStyleAdd extends BaseCommand {
  private readonly _style: TextStyleType
  private _selections: ISelection[]

  constructor (style: TextStyleType, toBeSaved: boolean) {
    super(toBeSaved)
    this._style = style
    this._selections = []
  }

  do (context: ITextEditor): void {
    this._selections = context.fetchData([new TextEditorRequest('textSelections')]).textSelections
    context.addTextStyleInSelections(this._selections, this._style)
    context.deleteTextCursorSelections()
    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }

  undo (context: ITextEditor): void {
    context.addTextCursorSelections(this._selections)
    context.deleteConcreteTextStylesInSelections(this._selections, this._style)
    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }
}

export { CommandTextStyleAdd }
