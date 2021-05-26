import { ITextArea } from '../visualization/ITextArea'
import { SetTextCursorPosition } from '../command-pipeline/commands/SetTextCursorPosition'
import { IInputEventManager } from './IInputEventManager'
import { CommandPasteText } from '../command-pipeline/commands/CommandPasteText'
import { InputEventHandler } from './InputEventHandler'
import { ICommandDispatcher } from '../command-pipeline/ICommandDispatcher'

class InputEventManager implements IInputEventManager {
  private readonly _textArea: ITextArea
  private readonly _commandDispatcher: ICommandDispatcher
  private _savedText: string

  constructor (textArea: ITextArea, commandDispatcher: ICommandDispatcher) {
    this._savedText = ''
    this._textArea = textArea
    this._commandDispatcher = commandDispatcher
  }

  triggerEventCopy (): void {
    this._savedText = this._commandDispatcher.fetchData('text-selected').getTextSelected()
  }

  triggerEventPaste (): void {
    this._commandDispatcher.doCommand(new CommandPasteText(true, this._savedText))
  }

  triggerEventChangeTextCursorPosition (displayX: number, displayY: number): void {
    const { x, y } = this._textArea.getTextPosition(displayX, displayY)
    this._commandDispatcher.doCommand(new SetTextCursorPosition(false, x, y))
  }

  showUiElementOnInteractiveContext (uiElement: HTMLElement): void {
    this._textArea.getInteractiveLayerContext().append(uiElement)
  }

  subscribeToEvent (
    event: keyof HTMLElementEventMap,
    eventHandler: InputEventHandler,
    context: HTMLElement = this._textArea.getInteractiveLayerContext()
  ): void {
    context.addEventListener(
      event,
      (e: MouseEvent | KeyboardEvent) => eventHandler({
        event: e,
        commandDispatcher: this._commandDispatcher,
        interactiveLayer: this._textArea.getInteractiveLayerContext()
      })
    )
  }
}

export { InputEventManager }
