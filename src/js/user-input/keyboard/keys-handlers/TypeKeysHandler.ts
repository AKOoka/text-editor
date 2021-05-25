import { AddTextCommand } from '../../../command-pipeline/commands/AddTextCommand'
import { BaseKeyHandler } from './BaseKeyHandler'
import { IInputEventHandlerPayload } from '../../IInputEventHandlerPayload'

class TypeKeysHandler extends BaseKeyHandler {
  handleEvent (payload: IInputEventHandlerPayload<KeyboardEvent>): void {
    payload.commandDispatcher.doCommand(new AddTextCommand(payload.event.key, false))
  }
}

export { TypeKeysHandler }
