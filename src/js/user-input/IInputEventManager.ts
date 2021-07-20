import { BaseCommand } from '../command-pipeline/commands/BaseCommand'
import { Point } from '../common/Point'
import { InputModifiers } from './InputModifiers'
import { InteractiveHtmlElement } from './InteractiveElement'

export interface IInputEventHandlerPayload<E extends Event> {
  event: E
  inputEventManager: IInputEventManager
  inputModifiers: InputModifiers
}

export type InputEventHandler = (payload: IInputEventHandlerPayload<MouseEvent | KeyboardEvent>) => void

export interface IInputEventManager {
  triggerEventChangeTextCursorPosition: (displayPoint: Point) => void
  triggerEventSelectionStartMouse: () => void
  triggerEventSelectionContinueMouse: () => void
  triggerEventSelectionContinueKeyboard: () => void
  triggerEventSelectionEndMouse: () => void
  triggerEventSelectionEndKeyboard: () => void
  triggerEventSelectionDeleteAll: () => void
  triggerEventTextCursorMoveY: (offsetY: number) => void
  triggerEventDoCommand: (command: BaseCommand) => void
  triggerEventUndoCommand: () => void
  triggerEventRedoCommand: () => void
  showInteractiveElement: (displayPoint: Point, element: InteractiveHtmlElement) => void
  subscribeToEvent: (event: keyof HTMLElementEventMap, eventHandler: InputEventHandler, context?: HTMLElement) => void
}
