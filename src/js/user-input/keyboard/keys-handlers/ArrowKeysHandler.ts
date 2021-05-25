import { HorMoveTextCursor } from '../../../command-pipeline/commands/HorMoveTextCursor'
import { VerMoveTextCursor } from '../../../command-pipeline/commands/VerMoveTextCursor'
import { BaseKeyHandler } from './BaseKeyHandler'
import { IInputEventHandlerPayload } from '../../IInputEventHandlerPayload'

class ArrowKeysHandler extends BaseKeyHandler {
  handleEvent (payload: IInputEventHandlerPayload<KeyboardEvent>): void {
    switch (payload.event.key) {
      case 'ArrowLeft':
        payload.commandDispatcher.doCommand(new HorMoveTextCursor(false, -1))
        break
      case 'ArrowRight':
        payload.commandDispatcher.doCommand(new HorMoveTextCursor(false, 1))
        break
      case 'ArrowDown':
        payload.commandDispatcher.doCommand(new VerMoveTextCursor(false, 1))
        break
      case 'ArrowUp':
        payload.commandDispatcher.doCommand(new VerMoveTextCursor(false, -1))
        break
      default:
        this._nextHandler.handleEvent(payload)
    }
  }
}

export { ArrowKeysHandler }
