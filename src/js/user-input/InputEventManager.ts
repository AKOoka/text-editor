import { ITextArea } from '../visualization/ITextArea'
import { CommandTextCursorSetPosition } from '../command-pipeline/commands/CommandTextCursorSetPosition'
import { IInputEventManager } from './IInputEventManager'
import { ICommandDispatcher } from '../command-pipeline/ICommandDispatcher'
import { IPoint } from '../common/IPoint'
import { Range } from '../common/Range'
import { Selection } from '../common/Selection'
import { CommandSelectionDeleteAll } from '../command-pipeline/commands/CommandSelectionsDelete'
import { CommandSelectionAdd } from '../command-pipeline/commands/CommandSelectionAdd'
import { CommandSelectionDeleteLast } from '../command-pipeline/commands/CommandSelectionDeleteLast'
import { CommandSelectionChangeLast } from '../command-pipeline/commands/CommandSelectionChangeLast'

export interface InputModifiers {
  selecting: boolean
}

export interface IInputEventHandlerPayload<E extends Event> {
  event: E
  commandDispatcher: ICommandDispatcher
  inputModifiers: InputModifiers
}

export type InputEventHandler = (payload: IInputEventHandlerPayload<MouseEvent | KeyboardEvent>) => void

export class InputEventManager implements IInputEventManager {
  private readonly _textArea: ITextArea
  private readonly _commandDispatcher: ICommandDispatcher
  private readonly _inputModifiers: InputModifiers
  private _selectionAnchorPoint: IPoint
  private _selections: Selection[]

  constructor (textArea: ITextArea, commandDispatcher: ICommandDispatcher) {
    this._textArea = textArea
    this._commandDispatcher = commandDispatcher
    this._inputModifiers = {
      selecting: false
    }
    this._selections = []
  }

  triggerEventChangeTextCursorPosition (mousePoint: IPoint): void {
    this._commandDispatcher.doCommand(new CommandTextCursorSetPosition(false, this._textArea.convertDisplayPosition(mousePoint)))
  }

  triggerEventSelectionStart (startPoint: IPoint): void {
    const { x, y } = startPoint
    const newSelection = new Selection(new Range(x, x), new Range(y, y))

    this._selectionAnchorPoint = startPoint
    this._inputModifiers.selecting = true
    this._selections.push(newSelection)
    this._commandDispatcher.doCommand(new CommandSelectionAdd(newSelection, false))
  }

  triggerEventSelectionStartMouse (startMousePoint: IPoint): void {
    this.triggerEventSelectionStart(this._textArea.convertDisplayPosition(startMousePoint))
  }

  triggerEventSelectionMove (point: IPoint): void {
    const selection = this._selections[this._selections.length - 1]
    if (point.y === this._selectionAnchorPoint.y) {
      if (point.x > this._selectionAnchorPoint.x) {
        selection.reset(this._selectionAnchorPoint, point)
      } else {
        selection.reset(point, this._selectionAnchorPoint)
      }
    } else {
      selection.resetEnd(point)
    }
    this._commandDispatcher.doCommand(new CommandSelectionChangeLast(selection, false))
  }

  triggerEventSelectionMoveMouse (mousePoint: IPoint): void {
    this.triggerEventSelectionMove(this._textArea.convertDisplayPosition(mousePoint))
  }

  triggerEventSelectionEnd (): void {
    const selection: Selection = this._selections[this._selections.length - 1]
    this._inputModifiers.selecting = false

    if (selection.rangeX.width === 0 && selection.rangeY.width === 0) {
      this._selections.pop()
      this._commandDispatcher.doCommand(new CommandSelectionDeleteLast(false))
    }
  }

  triggerEventSelectionDeleteAll (): void {
    this._selections = []
    this._inputModifiers.selecting = false
    this._commandDispatcher.doCommand(new CommandSelectionDeleteAll(false))
  }

  showInteractiveElement (displayPoint: IPoint, uiElement: HTMLElement): void {
    this._textArea.showInteractiveElement(displayPoint, uiElement)
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
          inputModifiers: this._inputModifiers
        })
      }
    )
  }
}
