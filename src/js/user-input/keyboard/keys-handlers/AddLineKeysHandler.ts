import { BaseKeysHandler } from './BaseKeysHandler'
import { IInputEventHandlerPayload } from '../../IInputEventManager'
import { CommandLineAdd } from '../../../command-pipeline/commands/CommandLineAdd'

class AddLineKeysHandler extends BaseKeysHandler {
  handleEvent (payload: IInputEventHandlerPayload<KeyboardEvent>): void {
    const { event, inputEventManager } = payload
    switch (event.key) {
      case 'Enter':
        inputEventManager.triggerEventDoCommand(new CommandLineAdd(1, false))
        break
      default:
        this._nextHandler.handleEvent(payload)
        break
    }
  }
}

export { AddLineKeysHandler }
