import { InputEventHandler } from './InputEventHandler'
import { IPoint } from '../common/IPoint'

export interface IInputEventManager {
  triggerEventCopy: () => void
  triggerEventPaste: () => void
  triggerEventChangeTextCursorPosition: (displayPoint: IPoint) => void
  showUiElementOnInteractiveContext: (displayPoint: IPoint, uiElement: HTMLElement) => void
  subscribeToEvent: (event: keyof HTMLElementEventMap, eventHandler: InputEventHandler, context?: HTMLElement) => void
}
