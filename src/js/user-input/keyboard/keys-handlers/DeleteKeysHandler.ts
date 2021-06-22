import { CommandTextDelete } from '../../../command-pipeline/commands/CommandTextDelete'
import { IInputEventHandlerPayload } from '../../IInputEventManager'
import { BaseKeysHandler } from './BaseKeysHandler'

class DeleteKeysHandler extends BaseKeysHandler {
  handleEvent (payload: IInputEventHandlerPayload<KeyboardEvent>): void {
    const { event, inputEventManager } = payload
    switch (event.key) {
      case 'Delete':
        inputEventManager.triggerEventDoCommand(new CommandTextDelete(false, 0, 1))
        break
      case 'Backspace':
        inputEventManager.triggerEventDoCommand(new CommandTextDelete(false, -1, 0))
        break
      default:
        this._nextHandler.handleEvent(payload)
        break
    }
  }
}

export { DeleteKeysHandler }
