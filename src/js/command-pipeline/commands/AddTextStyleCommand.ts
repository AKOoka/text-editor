import { ICommand } from '../ICommand'
import { ITextEditor } from '../../core/ITextEditor'
import { TextStyleType } from '../../common/TextStyleType'

class AddTextStyleCommand implements ICommand {
  private readonly _style: TextStyleType
  private readonly _toBeSaved: boolean

  constructor (style: TextStyleType, toBeSaved: boolean) {
    this._style = style
    this._toBeSaved = toBeSaved
  }

  toBeSaved (): boolean {
    return this._toBeSaved
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
