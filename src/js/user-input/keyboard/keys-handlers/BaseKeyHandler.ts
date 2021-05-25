import { IInputEventHandlerPayload } from '../../IInputEventHandlerPayload'

abstract class BaseKeyHandler {
  protected _nextHandler: BaseKeyHandler

  setNextHandler (handler: BaseKeyHandler): void {
    this._nextHandler = handler
  }

  abstract handleEvent (payload: IInputEventHandlerPayload<KeyboardEvent>): void
}

export { BaseKeyHandler }
