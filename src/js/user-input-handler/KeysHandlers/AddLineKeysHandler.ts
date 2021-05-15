import { BaseKeyHandler } from './BaseKeyHandler'
import { AddLineCommand } from '../../command-pipeline/commands/AddLineCommand'

class AddLineKeysHandler extends BaseKeyHandler {
  handleEvent (event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
        this._commandDispatcher.doCommand(new AddLineCommand(1, true))
        break
      default:
        this._nextHandler.handleEvent(event)
        break
    }
  }
}

export { AddLineKeysHandler }
