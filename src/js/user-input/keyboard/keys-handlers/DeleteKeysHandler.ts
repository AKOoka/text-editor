import { CommandTextDelete } from '../../../command-pipeline/commands/CommandTextDelete'
import { BaseKeyHandler } from './BaseKeyHandler'
import { IInputEventHandlerPayload } from '../../IInputEventHandlerPayload'

class DeleteKeysHandler extends BaseKeyHandler {
  handleEvent (payload: IInputEventHandlerPayload<KeyboardEvent>): void {
    switch (payload.event.key) {
      case 'Delete':
        payload.commandDispatcher.doCommand(new CommandTextDelete(true, 0, 1))
        break
      case 'Backspace':
        payload.commandDispatcher.doCommand(new CommandTextDelete(true, -1, 0))
        break
      default:
        this._nextHandler.handleEvent(payload)
        break
    }
  }
}

export { DeleteKeysHandler }
