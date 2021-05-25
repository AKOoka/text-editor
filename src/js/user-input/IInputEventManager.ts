import { InputEventHandler } from './InputEventHandler'

export interface IInputEventManager {
  triggerEventCopy: () => void
  triggerEventPaste: () => void
  triggerEventChangeTextCursorPosition: (displayX: number, displayY: number) => void
  showUiElement: (uiElement: HTMLElement) => void
  subscribeToEvent: (event: keyof HTMLElementEventMap, eventHandler: InputEventHandler, context?: HTMLElement) => void
}
