import { IInputEventHandlerPayload } from './IInputEventHandlerPayload'

export type InputEventHandler = (payload: IInputEventHandlerPayload<MouseEvent | KeyboardEvent>) => void
