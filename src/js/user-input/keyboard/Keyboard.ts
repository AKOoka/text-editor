import { BaseKeysHandler } from './keys-handlers/BaseKeysHandler'
import { TypeKeysHandler } from './keys-handlers/TypeKeysHandler'
import { DeleteKeysHandler } from './keys-handlers/DeleteKeysHandler'
import { ArrowKeysHandler } from './keys-handlers/ArrowKeysHandler'
import { AddLineKeysHandler } from './keys-handlers/AddLineKeysHandler'
import { IInputEventManager } from '../IInputEventManager'
import { SpecialKeysHandler } from './keys-handlers/SpecialKeysHandler'

class Keyboard {
  private _lastHandler: BaseKeysHandler

  constructor () {
    this.addKeysHandler(new TypeKeysHandler())
    this.addKeysHandler(new DeleteKeysHandler())
    this.addKeysHandler(new ArrowKeysHandler())
    this.addKeysHandler(new AddLineKeysHandler())
    this.addKeysHandler(new SpecialKeysHandler())
  }

  addKeysHandler (handler: BaseKeysHandler): void {
    if (this._lastHandler !== undefined) {
      handler.setNextHandler(this._lastHandler)
    }
    this._lastHandler = handler
  }

  setInputEventManager (inputEventManager: IInputEventManager): void {
    if (this._lastHandler === undefined) {
      throw new Error('there was no handlers to set on')
    }
    inputEventManager.subscribeToEvent('keydown', this._lastHandler.handleEvent.bind(this._lastHandler), document.body)
  }
}

export { Keyboard }
