import { ITextArea } from '../visualization/ITextArea'
import { CommandTextCursorSetPosition } from '../command-pipeline/commands/CommandTextCursorSetPosition'
import { IInputEventManager } from './IInputEventManager'
import { InputEventHandler } from './InputEventHandler'
import { ICommandDispatcher } from '../command-pipeline/ICommandDispatcher'
import { IPoint } from '../common/IPoint'

class InputEventManager implements IInputEventManager {
  private readonly _textArea: ITextArea
  private readonly _commandDispatcher: ICommandDispatcher

  constructor (textArea: ITextArea, commandDispatcher: ICommandDispatcher) {
    this._textArea = textArea
    this._commandDispatcher = commandDispatcher
  }

  triggerEventCopy (): void {
    // this._commandDispatcher.doCommand(new CommandContentCopy())
  }

  triggerEventPaste (): void {
    // this._commandDispatcher.doCommand(new CommandContentPaste(true))
  }

  triggerEventChangeTextCursorPosition (displayPoint: IPoint): void {
    this._commandDispatcher.doCommand(new CommandTextCursorSetPosition(false, this._textArea.convertToTextPosition(displayPoint)))
  }

  showUiElementOnInteractiveContext (displayPoint: IPoint, uiElement: HTMLElement): void {
    this._textArea.showElementOnInteractiveLayer(displayPoint, uiElement)
  }

  subscribeToEvent (
    event: keyof HTMLElementEventMap,
    eventHandler: InputEventHandler,
    context: HTMLElement = this._textArea.getInteractiveLayerContext()
  ): void {
    context.addEventListener(
      event,
      (e: MouseEvent | KeyboardEvent) => {
        e.preventDefault()
        eventHandler({
          event: e,
          commandDispatcher: this._commandDispatcher,
          interactiveLayer: this._textArea.getInteractiveLayerContext()
        })
      }
    )
  }
}

export { InputEventManager }
