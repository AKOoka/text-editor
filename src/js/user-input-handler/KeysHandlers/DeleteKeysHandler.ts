import { DeleteTextCommand } from '../../command-pipeline/commands/DeleteTextCommand'
import { BaseKeyHandler } from './BaseKeyHandler'

class DeleteKeysHandler extends BaseKeyHandler {
  handleEvent (event: KeyboardEvent): void {
    switch (event.key) {
      case 'Delete':
        this._commandDispatcher.doCommand(new DeleteTextCommand(true, 1, 0))
        break
      case 'Backspace':
        this._commandDispatcher.doCommand(new DeleteTextCommand(true, -1, -1))
        break
      default:
        this._nextHandler.handleEvent(event)
        break
    }
  }
}

export { DeleteKeysHandler }
