import { ITextEditor } from '../../core/ITextEditor'
import { BaseCommand } from './BaseCommand'
import { Selection } from '../../common/Selection'
import { TextStyle } from '../../common/TextStyle'

export class CommandTextStyleAdd extends BaseCommand {
  private readonly _style: TextStyle
  private _selections: Selection[]

  constructor (style: TextStyle, toBeSaved: boolean) {
    super(toBeSaved)
    this._style = style
    this._selections = []
  }

  do (context: ITextEditor): void {
    this._selections = context.getTextCursorSelections()
    context.addTextStyleInSelections(this._selections, this._style)
    context.deleteAllTextCursorSelections()
    context.updateTextRepresentation()
    context.updateTextCursorSelections()
  }

  undo (context: ITextEditor): void {
    context.addTextCursorSelections(this._selections)
    context.deleteConcreteTextStylesInSelections(this._selections, this._style)
    context.updateTextRepresentation()
    context.updateTextCursorSelections()
  }
}
