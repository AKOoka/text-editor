import { ICommandDispatcher } from '../command-pipeline/ICommandDispatcher'
import { IIoDeviceEventHandler } from './IIoDeviceEventHandler'

class IoDevice {
  private readonly _commandDispatcher: ICommandDispatcher
  private _lastHandler: IIoDeviceEventHandler
  private readonly _context: Document

  constructor (context: Document, commandDispatcher: ICommandDispatcher) {
    this._commandDispatcher = commandDispatcher
    this._context = context
  }

  addKeysHandler (handler: IIoDeviceEventHandler): void {
    handler.setCommandDispatcher(this._commandDispatcher)
    if (this._lastHandler !== undefined) {
      handler.setNextHandler(this._lastHandler)
    }
    this._lastHandler = handler
  }

  setHandlersOnKeyDown (): void {
    if (this._lastHandler === undefined) {
      throw new Error('there was no handlers to set on')
    }
    this._context.onkeydown = (e) => {
      this._lastHandler.handleEvent(e)
    }
  }
}

export { IoDevice }
