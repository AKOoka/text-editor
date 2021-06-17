import { CommandTextAdd } from '../../../command-pipeline/commands/CommandTextAdd'
import { CommandTextCursorMoveX } from '../../../command-pipeline/commands/CommandTextCursorMoveX'
import { IInputEventHandlerPayload } from '../../IInputEventManager'
import { BaseKeysHandler } from './BaseKeysHandler'

class TypeKeysHandler extends BaseKeysHandler {
  handleEvent (payload: IInputEventHandlerPayload<KeyboardEvent>): void {
    const { event, inputEventManager, inputModifiers, commandDispatcher } = payload
    if (inputModifiers.selectingMode) {
      inputEventManager.triggerEventSelectionDeleteAll()
    }
    commandDispatcher.doCommand(new CommandTextAdd(event.key, false))
    commandDispatcher.doCommand(new CommandTextCursorMoveX(false, event.key.length))
  }
}

export { TypeKeysHandler }
