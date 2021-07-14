import { CommandTextCursorMoveX } from '../../../command-pipeline/commands/CommandTextCursorMoveX'
import { IInputEventHandlerPayload } from '../../IInputEventManager'
import { BaseKeysHandler } from './BaseKeysHandler'

class ArrowKeysHandler extends BaseKeysHandler {
  private _moveTextCursor (payload: IInputEventHandlerPayload<KeyboardEvent>, moveCommand: () => void): void {
    const { inputEventManager, inputModifiers, event } = payload
    if (event.shiftKey) {
      inputEventManager.triggerEventSelectionContinueKeyboard()
    } else if (inputModifiers.selectingMode) {
      inputEventManager.triggerEventSelectionDeleteAll()
    }

    // inputEventManager.triggerEventDoCommand(moveCommand)
    // inputEventManager.triggerEventTextCursorMoveY()
    moveCommand()

    if (inputModifiers.selectingModeKeyboard) {
      inputEventManager.triggerEventSelectionEndKeyboard()
    }
  }

  private _moveTextCursorY (payload: IInputEventHandlerPayload<KeyboardEvent>, offsetY: number): void {
    this._moveTextCursor(payload, payload.inputEventManager.triggerEventTextCursorMoveY.bind(payload.inputEventManager, offsetY))
  }

  private _moveTextCursorX (payload: IInputEventHandlerPayload<KeyboardEvent>, offsetX: number): void {
    this._moveTextCursor(payload, payload.inputEventManager.triggerEventDoCommand.bind(payload.inputEventManager, new CommandTextCursorMoveX(false, offsetX)))
  }

  handleEvent (payload: IInputEventHandlerPayload<KeyboardEvent>): void {
    switch (payload.event.key) {
      case 'ArrowLeft':
        // this._moveTextCursor(payload, new CommandTextCursorMoveX(false, -1))
        this._moveTextCursorX(payload, -1)
        break
      case 'ArrowRight':
        // this._moveTextCursor(payload, new CommandTextCursorMoveX(false, 1))
        this._moveTextCursorX(payload, 1)
        break
      case 'ArrowDown':
        // this._moveTextCursor(payload, new CommandTextCursorMoveY(false, 1))
        this._moveTextCursorY(payload, 1)
        break
      case 'ArrowUp':
        // this._moveTextCursor(payload, new CommandTextCursorMoveY(false, -1))
        this._moveTextCursorY(payload, -1)
        break
      default:
        this._nextHandler.handleEvent(payload)
    }
  }
}

export { ArrowKeysHandler }
