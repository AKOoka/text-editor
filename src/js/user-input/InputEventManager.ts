import { IHtmlMeasurer } from '../visualization/IHtmlMeasurer'
import { CommandTextCursorSetPoint } from '../command-pipeline/commands/CommandTextCursorSetPoint'
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
import { InteractiveHtmlElement } from './InteractiveElement'

export class InputEventManager implements IInputEventManager, ITextCursorPositionSubscriber {
  private readonly _htmlContext: HTMLElement
  private readonly _htmlMeasurer: IHtmlMeasurer
  private readonly _commandDispatcher: ICommandDispatcher
  private readonly _inputModifiers: InputModifiers
  private _selection: Selection
  private _textCursorPoint: Point
  private _selectionAnchorPoint: Point

  constructor (htmlMeasurer: IHtmlMeasurer, commandDispatcher: ICommandDispatcher) {
    this._htmlContext = this._createHtmlContext()
    this._htmlMeasurer = htmlMeasurer
    this._commandDispatcher = commandDispatcher
    this._inputModifiers = new InputModifiers()
    this._selection = new Selection(new Range(0, 0), new Range(0, 0))
  }

  private _createHtmlContext (): HTMLElement {
    const htmlContext: HTMLElement = document.createElement('div')
    htmlContext.classList.add('layer-interactive')
    return htmlContext
  }

  private _selectionStart (): void {
    const { x, y } = this._textCursorPoint
    this._selection = this._selection.copy().resetWithPositions(x, y, x, y)
    this._inputModifiers.selectingMode = true
    this._selectionAnchorPoint = this._textCursorPoint
    this._commandDispatcher.doCommand(new CommandSelectionAdd(this._selection, false))
  }

  private _updateSelection (point: Point): void {
    if (point.y === this._selectionAnchorPoint.y) {
      if (point.x > this._selectionAnchorPoint.x) {
        this._selection.resetWithPoints(this._selectionAnchorPoint, point)
      } else {
        this._selection.resetWithPoints(point, this._selectionAnchorPoint)
      }
    } else if (point.y > this._selectionAnchorPoint.y) {
      this._selection.resetWithPoints(this._selectionAnchorPoint, point)
    } else {
      this._selection.resetWithPoints(point, this._selectionAnchorPoint)
    }
    this._commandDispatcher.doCommand(new CommandSelectionChangeLast(this._selection, false))
  }

  private _normalizeDisplayPoint (displayPoint: Point): Point {
    const boundaries = this._htmlContext.getBoundingClientRect()
    return displayPoint.translate(-boundaries.x, -boundaries.y)
  }

  getHtmlContext (): HTMLElement {
    return this._htmlContext
  }

  triggerEventChangeTextCursorPosition (mousePoint: Point): void {
    this._commandDispatcher.doCommand(
      new CommandTextCursorSetPoint(
        false,
        this._htmlMeasurer.convertDisplayPointToPoint(this._normalizeDisplayPoint(mousePoint))
      )
    )
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
    this._inputModifiers.reset()
    this._commandDispatcher.doCommand(new CommandSelectionDeleteAll(false))
  }

  triggerEventTextCursorMoveY (offsetY: number): void {
    this._commandDispatcher.doCommand(
      new CommandTextCursorSetPoint(false, this._htmlMeasurer.translatePoint(this._textCursorPoint.copy(), offsetY))
    )
  }

  triggerEventDoCommand (command: BaseCommand): void {
    this._commandDispatcher.doCommand(command)
  }

  triggerEventUndoCommand (): void {
    this._commandDispatcher.undoCommand()
  }

  triggerEventRedoCommand (): void {
    this._commandDispatcher.redoCommand()
  }

  showInteractiveElement (displayPoint: Point, element: InteractiveHtmlElement): void {
    element.setPoint(
      displayPoint.translate(
        this._htmlContext.getBoundingClientRect().x,
        this._htmlContext.getBoundingClientRect().y
      )
    )
    this._htmlContext.append(element.context)
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
    htmlContext: HTMLElement = this._htmlContext
  ): void {
    htmlContext.addEventListener(
      event,
      (event: MouseEvent | KeyboardEvent) => {
        event.preventDefault()
        eventHandler({
          event,
          inputEventManager: this,
          inputModifiers: this._inputModifiers
        })
      }
    )
  }
}
