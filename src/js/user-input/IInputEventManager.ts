import { IPoint } from '../common/IPoint'
import { InputEventHandler } from './InputEventManager'

export interface IInputEventManager {
  triggerEventChangeTextCursorPosition: (displayPoint: IPoint) => void
  triggerEventSelectionStart: (startPoint: IPoint) => void
  triggerEventSelectionStartMouse: (startMousePoint: IPoint) => void
  triggerEventSelectionMove: (point: IPoint) => void
  triggerEventSelectionMoveMouse: (mousePoint: IPoint) => void
  triggerEventSelectionEnd: () => void
  triggerEventSelectionDeleteAll: () => void
  showInteractiveElement: (displayPoint: IPoint, element: HTMLElement) => void
  subscribeToEvent: (event: keyof HTMLElementEventMap, eventHandler: InputEventHandler, context?: HTMLElement) => void
}
