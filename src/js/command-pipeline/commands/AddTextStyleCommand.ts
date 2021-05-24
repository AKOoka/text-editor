import { ITextEditor } from '../../core/ITextEditor'
import { TextStyleType } from '../../common/TextStyleType'
import { BaseCommand } from './BaseCommand'
import { IRange } from '../../common/IRange'

class AddTextStyleCommand extends BaseCommand {
  private readonly _style: TextStyleType
  private _selections: IRange[]

  constructor (style: TextStyleType, toBeSaved: boolean) {
    super(toBeSaved)
    this._style = style
    this._selections = []
  }

  do (context: ITextEditor): void {
    context.addTextStyle(this._style)
    this._selections = context.clearSelections()
    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }

  undo (context: ITextEditor): void {
    context.addSelections(this._selections)
    context.removeConcreteTextStyle(this._style)
    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }
}

export { AddTextStyleCommand }
