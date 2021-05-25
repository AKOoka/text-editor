import { ICommandDispatcher } from '../command-pipeline/ICommandDispatcher'

export interface IInputEventHandlerPayload<E extends Event> {
  event: E
  commandDispatcher: ICommandDispatcher
  interactiveLayer: HTMLElement
}
