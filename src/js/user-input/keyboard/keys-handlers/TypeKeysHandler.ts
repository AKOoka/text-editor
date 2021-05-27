import { CommandTextAdd } from '../../../command-pipeline/commands/CommandTextAdd'
import { BaseKeyHandler } from './BaseKeyHandler'
import { IInputEventHandlerPayload } from '../../IInputEventHandlerPayload'

class TypeKeysHandler extends BaseKeyHandler {
  handleEvent (payload: IInputEventHandlerPayload<KeyboardEvent>): void {
    payload.commandDispatcher.doCommand(new CommandTextAdd(payload.event.key, false))
  }
}

export { TypeKeysHandler }
