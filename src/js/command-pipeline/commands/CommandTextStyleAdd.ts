import { ITextEditor } from '../../core/ITextEditor'
import { TextStyleType } from '../../common/TextStyleType'
import { BaseCommand } from './BaseCommand'
import { Selection } from '../../common/Selection'

class CommandTextStyleAdd extends BaseCommand {
  private readonly _style: TextStyleType
  private _selections: Selection[]

  constructor (style: TextStyleType, toBeSaved: boolean) {
    super(toBeSaved)
    this._style = style
    this._selections = []
  }

  do (context: ITextEditor): void {
    this._selections = context.getTextCursorSelections()
    context.addTextStyleInSelections(this._selections, this._style)
    context.deleteAllTextCursorSelections()
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
