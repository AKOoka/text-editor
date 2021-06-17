import { CommandTextAdd } from '../../../command-pipeline/commands/CommandTextAdd'
import { IInputEventHandlerPayload } from '../../IInputEventManager'
import { BaseKeysHandler } from './BaseKeysHandler'

class TypeKeysHandler extends BaseKeysHandler {
  handleEvent (payload: IInputEventHandlerPayload<KeyboardEvent>): void {
    const { inputEventManager, inputModifiers, commandDispatcher } = payload
    if (inputModifiers.selectingMode) {
      inputEventManager.triggerEventSelectionDeleteAll()
    }
    commandDispatcher.doCommand(new CommandTextAdd(payload.event.key, false))
  }
}

export { TypeKeysHandler }
