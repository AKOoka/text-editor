import { ITextEditor } from '../../core/ITextEditor'
import { TextStyleType } from '../../common/TextStyleType'
import { BaseCommand } from './BaseCommand'

class AddTextStyleCommand extends BaseCommand {
  private readonly _style: TextStyleType

  constructor (style: TextStyleType, toBeSaved: boolean) {
    super(toBeSaved)
    this._style = style
  }

  do (context: ITextEditor): void {
    context.addTextStyle(this._style)
    context.updateTextRepresentation()
  }

  undo (context: ITextEditor): void {
    context.deleteTextStyle(this._style)
    context.updateTextRepresentation()
  }
}

export { AddTextStyleCommand }
