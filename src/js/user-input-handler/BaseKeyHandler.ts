import { ICommandDispatcher } from '../command-pipeline/ICommandDispatcher'
import { IIoDeviceEventHandler } from './IIoDeviceEventHandler'

abstract class BaseKeyHandler implements IIoDeviceEventHandler {
  protected _commandDispatcher: ICommandDispatcher
  protected _nextHandler: IIoDeviceEventHandler

  setCommandDispatcher (commandDispatcher: ICommandDispatcher): void {
    this._commandDispatcher = commandDispatcher
  }

  setNextHandler (handler: IIoDeviceEventHandler): void {
    this._nextHandler = handler
  }

  abstract handleEvent (event: KeyboardEvent): void
}

export { BaseKeyHandler }
