import { CommandTextDelete } from '../../../command-pipeline/commands/CommandTextDelete'
import { IInputEventHandlerPayload } from '../../IInputEventManager'
import { BaseKeysHandler } from './BaseKeysHandler'

class DeleteKeysHandler extends BaseKeysHandler {
  handleEvent (payload: IInputEventHandlerPayload<KeyboardEvent>): void {
    const { event, commandDispatcher } = payload
    switch (event.key) {
      case 'Delete':
        commandDispatcher.doCommand(new CommandTextDelete(false, 0, 1))
        break
      case 'Backspace':
        commandDispatcher.doCommand(new CommandTextDelete(false, -1, 0))
        break
      default:
        this._nextHandler.handleEvent(payload)
        break
    }
  }
}

export { DeleteKeysHandler }
