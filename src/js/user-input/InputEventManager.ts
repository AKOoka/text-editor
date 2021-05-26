import { ITextArea } from '../visualization/ITextArea'
import { SetTextCursorPosition } from '../command-pipeline/commands/SetTextCursorPosition'
import { IInputEventManager } from './IInputEventManager'
import { CommandPasteContent } from '../command-pipeline/commands/CommandPasteContent'
import { InputEventHandler } from './InputEventHandler'
import { ICommandDispatcher } from '../command-pipeline/ICommandDispatcher'
import { NodeRepresentation } from '../core/TextRepresentation/Nodes/NodeRepresentation'

class InputEventManager implements IInputEventManager {
  private readonly _textArea: ITextArea
  private readonly _commandDispatcher: ICommandDispatcher
  private _savedContent: NodeRepresentation[]

  constructor (textArea: ITextArea, commandDispatcher: ICommandDispatcher) {
    this._textArea = textArea
    this._commandDispatcher = commandDispatcher
  }

  triggerEventCopy (): void {
    this._savedContent = this._commandDispatcher.fetchData('selectedContent').selectedContent
  }

  triggerEventPaste (): void {
    this._commandDispatcher.doCommand(new CommandPasteContent(true, this._savedContent))
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
