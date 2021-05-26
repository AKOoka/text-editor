import { InputEventHandler } from './InputEventHandler'

export interface IInputEventManager {
  triggerEventCopy: () => void
  triggerEventPaste: () => void
  triggerEventChangeTextCursorPosition: (displayX: number, displayY: number) => void
  showUiElementOnInteractiveContext: (uiElement: HTMLElement) => void
  subscribeToEvent: (event: keyof HTMLElementEventMap, eventHandler: InputEventHandler, context?: HTMLElement) => void
}
