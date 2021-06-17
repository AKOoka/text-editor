import { IInputEventHandlerPayload } from '../../IInputEventManager'
import { BaseKeysHandler } from './BaseKeysHandler'

const specialKeys = ['F5', 'Control', 'Shift', 'CapsLock', 'Tab']

export class SpecialKeysHandler extends BaseKeysHandler {
  handleEvent (payload: IInputEventHandlerPayload<KeyboardEvent>): void {
    if (!specialKeys.includes(payload.event.key)) {
      this._nextHandler.handleEvent(payload)
    }
  }
}
