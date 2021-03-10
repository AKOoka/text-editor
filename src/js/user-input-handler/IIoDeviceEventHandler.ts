import { ICommandDispatcher } from '../command-pipeline/ICommandDispatcher'

export interface IIoDeviceEventHandler {
  setCommandDispatcher: (commandDispatcher: ICommandDispatcher) => void
  setNextHandler: (handler: IIoDeviceEventHandler) => void
  handleEvent: (event: KeyboardEvent) => void
}
