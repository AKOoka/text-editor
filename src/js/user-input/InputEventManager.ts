import { ITextArea } from '../visualization/ITextArea'
import { CommandTextCursorSetPosition } from '../command-pipeline/commands/CommandTextCursorSetPosition'
import { IInputEventManager, InputEventHandler } from './IInputEventManager'
import { ICommandDispatcher } from '../command-pipeline/ICommandDispatcher'
import { Point } from '../common/Point'
import { Range } from '../common/Range'
import { Selection } from '../common/Selection'
import { CommandSelectionDeleteAll } from '../command-pipeline/commands/CommandSelectionsDelete'
import { CommandSelectionAdd } from '../command-pipeline/commands/CommandSelectionAdd'
import { CommandSelectionChangeLast } from '../command-pipeline/commands/CommandSelectionChangeLast'
import { BaseCommand } from '../command-pipeline/commands/BaseCommand'
import { ITextCursorPositionSubscriber } from '../common/ITextCursorPositionSubscriber'
import { InputModifiers } from './InputModifiers'

export class InputEventManager implements IInputEventManager, ITextCursorPositionSubscriber {
  private readonly _textArea: ITextArea
  private readonly _commandDispatcher: ICommandDispatcher
  private readonly _inputModifiers: InputModifiers
  private _textCursorPoint: Point
  private _selectionAnchorPoint: Point
  private _selections: Selection[]

  constructor (textArea: ITextArea, commandDispatcher: ICommandDispatcher) {
    this._textArea = textArea
    this._commandDispatcher = commandDispatcher
    this._inputModifiers = new InputModifiers()
    this._selections = []
  }

  private _selectionStart (): void {
    const { x, y } = this._textCursorPoint
    const newSelection = new Selection(new Range(x, x), new Range(y, y))

    this._inputModifiers.selectingMode = true
    this._selectionAnchorPoint = this._textCursorPoint
    this._selections.push(newSelection)
    this._commandDispatcher.doCommand(new CommandSelectionAdd(newSelection, false))
  }

  private _updateSelection (point: Point): void {
    const selection = this._selections[this._selections.length - 1]
    if (point.y === this._selectionAnchorPoint.y) {
      if (point.x > this._selectionAnchorPoint.x) {
        selection.reset(this._selectionAnchorPoint, point)
      } else {
        selection.reset(point, this._selectionAnchorPoint)
      }
    } else if (point.y > this._selectionAnchorPoint.y) {
      selection.reset(this._selectionAnchorPoint, point)
    } else {
      selection.reset(point, this._selectionAnchorPoint)
    }
    this._commandDispatcher.doCommand(new CommandSelectionChangeLast(selection, false))
  }

  triggerEventChangeTextCursorPosition (mousePoint: Point): void {
    this._commandDispatcher.doCommand(new CommandTextCursorSetPosition(false, this._textArea.convertDisplayPosition(mousePoint)))
  }

  triggerEventSelectionStartMouse (): void {
    this._inputModifiers.selectingModeMouse = true
    this._selectionStart()
  }

  triggerEventSelectionContinueKeyboard (): void {
    this._inputModifiers.selectingModeKeyboard = true
    if (!this._inputModifiers.selectingMode) {
      this._selectionStart()
    }
  }

  triggerEventSelectionContinueMouse (): void {
    this._inputModifiers.selectingModeMouse = true
  }

  triggerEventSelectionEndKeyboard (): void {
    this._inputModifiers.selectingModeKeyboard = false
  }

  triggerEventSelectionEndMouse (): void {
    this._inputModifiers.selectingModeMouse = false
  }

  triggerEventSelectionDeleteAll (): void {
    this._selections = []
    this._inputModifiers.clear()
    this._commandDispatcher.doCommand(new CommandSelectionDeleteAll(false))
  }

  triggerEventDoCommand (command: BaseCommand): void {
    this._commandDispatcher.doCommand(command)
  }

  showInteractiveElement (displayPoint: Point, uiElement: HTMLElement): void {
    this._textArea.showInteractiveElement(displayPoint, uiElement)
  }

  updateTextCursorPosition (textCursorPoint: Point): void {
    if (this._inputModifiers.selectingModeKeyboard || this._inputModifiers.selectingModeMouse) {
      this._updateSelection(textCursorPoint)
    }
    this._textCursorPoint = textCursorPoint
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
          inputEventManager: this,
          inputModifiers: this._inputModifiers
        })
      }
    )
  }
}
