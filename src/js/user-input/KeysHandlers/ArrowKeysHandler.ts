import { HorMoveTextCursor } from '../../command-pipeline/commands/HorMoveTextCursor'
import { VerMoveTextCursor } from '../../command-pipeline/commands/VerMoveTextCursor'
import { BaseKeyHandler } from './BaseKeyHandler'

class ArrowKeysHandler extends BaseKeyHandler {
  handleEvent (event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
        this._commandDispatcher.doCommand(new HorMoveTextCursor(false, -1))
        break
      case 'ArrowRight':
        this._commandDispatcher.doCommand(new HorMoveTextCursor(false, 1))
        break
      case 'ArrowDown':
        this._commandDispatcher.doCommand(new VerMoveTextCursor(false, 1))
        break
      case 'ArrowUp':
        this._commandDispatcher.doCommand(new VerMoveTextCursor(false, -1))
        break
      default:
        this._nextHandler.handleEvent(event)
    }
  }
}

export { ArrowKeysHandler }
