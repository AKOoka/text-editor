import { ITextArea } from '../visualization/ITextArea'
import { CommandTextCursorSetPosition } from '../command-pipeline/commands/CommandTextCursorSetPosition'
import { IInputEventManager } from './IInputEventManager'
import { CommandContentPaste } from '../command-pipeline/commands/CommandContentPaste'
import { InputEventHandler } from './InputEventHandler'
import { ICommandDispatcher } from '../command-pipeline/ICommandDispatcher'
import { NodeRepresentation } from '../core/TextRepresentation/NodeRepresentation'
import { IPoint } from '../common/IPoint'
import { TextEditorRequest } from '../common/TextEditorRequest'

class InputEventManager implements IInputEventManager {
  private readonly _textArea: ITextArea
  private readonly _commandDispatcher: ICommandDispatcher
  private _savedContent: NodeRepresentation[]

  constructor (textArea: ITextArea, commandDispatcher: ICommandDispatcher) {
    this._textArea = textArea
    this._commandDispatcher = commandDispatcher
  }

  triggerEventCopy (): void {
    this._savedContent = this._commandDispatcher.fetchData([new TextEditorRequest('selectedContent')]).selectedContent
  }

  triggerEventPaste (): void {
    this._commandDispatcher.doCommand(new CommandContentPaste(true, this._savedContent))
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
