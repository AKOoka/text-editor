import { IInputEventHandlerPayload } from '../../IInputEventManager'

export abstract class BaseKeysHandler {
  protected _nextHandler: BaseKeysHandler

  setNextHandler (handler: BaseKeysHandler): void {
    this._nextHandler = handler
  }

  abstract handleEvent (payload: IInputEventHandlerPayload<KeyboardEvent>): void
}
