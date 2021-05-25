import { BaseKeyHandler } from './keys-handlers/BaseKeyHandler'
import { TypeKeysHandler } from './keys-handlers/TypeKeysHandler'
import { DeleteKeysHandler } from './keys-handlers/DeleteKeysHandler'
import { ArrowKeysHandler } from './keys-handlers/ArrowKeysHandler'
import { AddLineKeysHandler } from './keys-handlers/AddLineKeysHandler'
import { IInputEventManager } from '../IInputEventManager'

class Keyboard {
  private _lastHandler: BaseKeyHandler

  constructor () {
    this.addKeysHandler(new TypeKeysHandler())
    this.addKeysHandler(new DeleteKeysHandler())
    this.addKeysHandler(new ArrowKeysHandler())
    this.addKeysHandler(new AddLineKeysHandler())
  }

  addKeysHandler (handler: BaseKeyHandler): void {
    if (this._lastHandler !== undefined) {
      handler.setNextHandler(this._lastHandler)
    }
    this._lastHandler = handler
  }

  setContext (context: IInputEventManager): void {
    if (this._lastHandler === undefined) {
      throw new Error('there was no handlers to set on')
    }
    context.subscribeToEvent('keydown', this._lastHandler.handleEvent.bind(this._lastHandler), document.body)
  }
}

export { Keyboard }
