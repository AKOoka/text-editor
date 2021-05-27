import { CommandTextCursorMoveX } from '../../../command-pipeline/commands/CommandTextCursorMoveX'
import { CommandTextCursorMoveY } from '../../../command-pipeline/commands/CommandTextCursorMoveY'
import { BaseKeyHandler } from './BaseKeyHandler'
import { IInputEventHandlerPayload } from '../../IInputEventHandlerPayload'

class ArrowKeysHandler extends BaseKeyHandler {
  handleEvent (payload: IInputEventHandlerPayload<KeyboardEvent>): void {
    switch (payload.event.key) {
      case 'ArrowLeft':
        payload.commandDispatcher.doCommand(new CommandTextCursorMoveX(false, -1))
        break
      case 'ArrowRight':
        payload.commandDispatcher.doCommand(new CommandTextCursorMoveX(false, 1))
        break
      case 'ArrowDown':
        payload.commandDispatcher.doCommand(new CommandTextCursorMoveY(false, 1))
        break
      case 'ArrowUp':
        payload.commandDispatcher.doCommand(new CommandTextCursorMoveY(false, -1))
        break
      default:
        this._nextHandler.handleEvent(payload)
    }
  }
}

export { ArrowKeysHandler }
