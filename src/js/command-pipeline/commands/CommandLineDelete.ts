import { ITextEditor } from '../../core/ITextEditor'
import { BaseCommand } from './BaseCommand'
import { Range } from '../../common/Range'

export class CommandLineDelete extends BaseCommand {
  private readonly _deleteRange: Range

  constructor (toBeSaved: boolean, deleteRange: Range) {
    super(toBeSaved)
    this._deleteRange = deleteRange
  }

  do (context: ITextEditor): void {
    context.deleteLinesInRange(this._deleteRange)
    context.updateTextRepresentation()
  }

  undo (): void {}
}
