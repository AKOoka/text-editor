import { DeleteTextCommand } from '../../../command-pipeline/commands/DeleteTextCommand'
import { BaseKeyHandler } from './BaseKeyHandler'
import { IInputEventHandlerPayload } from '../../IInputEventHandlerPayload'

class DeleteKeysHandler extends BaseKeyHandler {
  handleEvent (payload: IInputEventHandlerPayload<KeyboardEvent>): void {
    switch (payload.event.key) {
      case 'Delete':
        payload.commandDispatcher.doCommand(new DeleteTextCommand(true, 1, 0))
        break
      case 'Backspace':
        payload.commandDispatcher.doCommand(new DeleteTextCommand(true, -1, -1))
        break
      default:
        this._nextHandler.handleEvent(payload)
        break
    }
  }
}

export { DeleteKeysHandler }
