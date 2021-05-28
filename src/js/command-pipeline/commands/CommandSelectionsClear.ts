import { ITextEditor } from '../../core/ITextEditor'
import { BaseCommand } from './BaseCommand'
import { ISelection } from '../../common/ISelection'
import { TextEditorRequest } from '../../common/TextEditorRequest'

class CommandSelectionsClear extends BaseCommand {
  private _selections: ISelection[]

  do (context: ITextEditor): void {
    this._selections = context.fetchData([new TextEditorRequest('textSelections')]).textSelections
    context.deleteTextCursorSelections()
    context.updateTextCursorSelections()
  }

  undo (context: ITextEditor): void {
    context.addTextCursorSelections(this._selections)
    context.updateTextCursorSelections()
  }
}

export { CommandSelectionsClear }
