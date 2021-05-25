import { ITextArea } from '../visualization/ITextArea'
import { ICommandDispatcher } from '../command-pipeline/ICommandDispatcher'
import { SetTextCursorPosition } from '../command-pipeline/commands/SetTextCursorPosition'
import { IInputEventManager } from './IInputEventManager'
import { CommandPasteText } from '../command-pipeline/commands/CommandPasteText'
import { InputEventHandler } from './InputEventHandler'

class InputEventManager implements IInputEventManager {
  private readonly _interactiveContext: ITextArea
  private readonly _commandDispatcher: ICommandDispatcher
  private _savedText: string

  constructor (interactiveContext: ITextArea, commandDispatcher: ICommandDispatcher) {
    this._savedText = ''
    this._interactiveContext = interactiveContext
    this._commandDispatcher = commandDispatcher
  }

  triggerEventCopy (): void {
    this._savedText = this._commandDispatcher.fetchData('text-selected').getTextSelected()
  }

  triggerEventPaste (): void {
    this._commandDispatcher.doCommand(new CommandPasteText(true, this._savedText))
  }

  triggerEventChangeTextCursorPosition (displayX: number, displayY: number): void {
    const { x, y } = this._interactiveContext.getTextPosition(displayX, displayY)
    this._commandDispatcher.doCommand(new SetTextCursorPosition(false, x, y))
  }

  showUiElement (uiElement: HTMLElement): void {
    this._interactiveContext.getInteractiveLayerContext().append(uiElement)
  }

  subscribeToEvent (
    event: keyof HTMLElementEventMap,
    eventHandler: InputEventHandler,
    context: HTMLElement = this._interactiveContext.getInteractiveLayerContext()
  ): void {
    context.addEventListener(
      event,
      (e: MouseEvent | KeyboardEvent) => eventHandler({
        event: e,
        commandDispatcher: this._commandDispatcher,
        interactiveLayer: this._interactiveContext.getInteractiveLayerContext()
      })
    )
  }
}

export { InputEventManager }
