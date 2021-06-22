import { CommandTextAdd } from '../../../command-pipeline/commands/CommandTextAdd'
import { IInputEventHandlerPayload } from '../../IInputEventManager'
import { BaseKeysHandler } from './BaseKeysHandler'

class TypeKeysHandler extends BaseKeysHandler {
  handleEvent (payload: IInputEventHandlerPayload<KeyboardEvent>): void {
    const { event, inputEventManager, inputModifiers } = payload
    if (inputModifiers.selectingMode) {
      inputEventManager.triggerEventSelectionDeleteAll()
    }
    inputEventManager.triggerEventDoCommand(new CommandTextAdd(event.key, false))
  }
}

export { TypeKeysHandler }
