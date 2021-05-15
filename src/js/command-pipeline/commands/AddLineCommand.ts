import { ITextEditor } from '../../core/ITextEditor'
import { BaseCommand } from './BaseCommand'

class AddLineCommand extends BaseCommand {
  private readonly _count: number

  constructor (count: number, toBeSaved: boolean) {
    super(toBeSaved)
    this._count = count
  }

  do (context: ITextEditor): void {
    context.createNewTextLines(this._count)
    context.verticalMoveTextCursor(this._count)
    context.setHorizontalPositionTextCursor(0) // need to save position of cursor before change
    context.updateTextRepresentation()
    context.updateTextCursor()
  }

  undo (context: ITextEditor): void {
    context.verticalMoveTextCursor(-this._count)
    context.deleteTextLines(-this._count)
    context.updateTextRepresentation()
    context.updateTextCursor()
  }
}

export { AddLineCommand }
