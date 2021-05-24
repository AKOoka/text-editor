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
    context.moveTextCursorYPosition(this._count)
    context.setTextCursorXPosition(0)
    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }

  undo (context: ITextEditor): void {
    context.moveTextCursorYPosition(-this._count)
    context.deleteTextLines(-this._count)
    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }
}

export { AddLineCommand }
