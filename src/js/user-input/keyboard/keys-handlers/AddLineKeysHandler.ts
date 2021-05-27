import { BaseKeyHandler } from './BaseKeyHandler'
import { CommandLineAdd } from '../../../command-pipeline/commands/CommandLineAdd'
import { IInputEventHandlerPayload } from '../../IInputEventHandlerPayload'

class AddLineKeysHandler extends BaseKeyHandler {
  handleEvent (payload: IInputEventHandlerPayload<KeyboardEvent>): void {
    switch (payload.event.key) {
      case 'Enter':
        payload.commandDispatcher.doCommand(new CommandLineAdd(1, true))
        break
      default:
        this._nextHandler.handleEvent(payload)
        break
    }
  }
}

export { AddLineKeysHandler }
