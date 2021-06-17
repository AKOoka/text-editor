import { CommandTextCursorMoveX } from '../../../command-pipeline/commands/CommandTextCursorMoveX'
import { CommandTextCursorMoveY } from '../../../command-pipeline/commands/CommandTextCursorMoveY'
import { IInputEventHandlerPayload } from '../../IInputEventManager'
import { BaseKeysHandler } from './BaseKeysHandler'

class ArrowKeysHandler extends BaseKeysHandler {
  private _moveTextCursor (payload: IInputEventHandlerPayload<KeyboardEvent>, moveCommand: CommandTextCursorMoveX | CommandTextCursorMoveY): void {
    const { commandDispatcher, inputEventManager, inputModifiers, event } = payload
    if (event.shiftKey) {
      inputEventManager.triggerEventSelectionContinueKeyboard()
    } else if (inputModifiers.selectingMode) {
      inputEventManager.triggerEventSelectionDeleteAll()
    }

    commandDispatcher.doCommand(moveCommand)

    if (inputModifiers.selectingModeKeyboard) {
      inputEventManager.triggerEventSelectionEndKeyboard()
    }
  }

  handleEvent (payload: IInputEventHandlerPayload<KeyboardEvent>): void {
    switch (payload.event.key) {
      case 'ArrowLeft':
        this._moveTextCursor(payload, new CommandTextCursorMoveX(false, -1))
        break
      case 'ArrowRight':
        this._moveTextCursor(payload, new CommandTextCursorMoveX(false, 1))
        break
      case 'ArrowDown':
        this._moveTextCursor(payload, new CommandTextCursorMoveY(false, 1))
        break
      case 'ArrowUp':
        this._moveTextCursor(payload, new CommandTextCursorMoveY(false, -1))
        break
      default:
        this._nextHandler.handleEvent(payload)
    }
  }
}

export { ArrowKeysHandler }
