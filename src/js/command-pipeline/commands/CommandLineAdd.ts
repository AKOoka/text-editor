import { ITextEditor } from '../../core/ITextEditor'
import { BaseCommand } from './BaseCommand'

class CommandLineAdd extends BaseCommand {
  private readonly _count: number

  constructor (count: number, toBeSaved: boolean) {
    super(toBeSaved)
    this._count = count
  }

  do (context: ITextEditor): void {
    console.log(this._count)
    // context.addNewLinesInRange(this._count)
    // context.moveTextCursorYPosition(this._count)
    context.setTextCursorX(0)
    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }

  undo (context: ITextEditor): void {
    // context.moveTextCursorYPosition(-this._count)
    // context.deleteLinesInRange(-this._count)
    context.updateTextRepresentation()
    context.updateTextCursorPosition()
  }
}

export { CommandLineAdd }
