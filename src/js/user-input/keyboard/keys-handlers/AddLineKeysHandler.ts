import { BaseKeyHandler } from './BaseKeyHandler'
import { AddLineCommand } from '../../../command-pipeline/commands/AddLineCommand'
import { IInputEventHandlerPayload } from '../../IInputEventHandlerPayload'

class AddLineKeysHandler extends BaseKeyHandler {
  handleEvent (payload: IInputEventHandlerPayload<KeyboardEvent>): void {
    switch (payload.event.key) {
      case 'Enter':
        payload.commandDispatcher.doCommand(new AddLineCommand(1, true))
        break
      default:
        this._nextHandler.handleEvent(payload)
        break
    }
  }
}

export { AddLineKeysHandler }
