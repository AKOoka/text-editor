import { Point } from '../../common/Point'
import { IInputEventHandlerPayload, IInputEventManager } from '../IInputEventManager'
import { InteractiveHtmlElement } from '../InteractiveElement'
import { MouseContextualMenu } from './MouseContextualMenu'

class Mouse {
  private _inputEventManager: IInputEventManager
  private _displayPoint: Point
  private readonly _contextualMenu: MouseContextualMenu

  constructor () {
    this._displayPoint = new Point(0, 0)
    this._contextualMenu = new MouseContextualMenu()
  }

  private _handlerMouseDown (payload: IInputEventHandlerPayload<MouseEvent>): void {
    const { event, inputModifiers } = payload

    if (event.buttons === 2) {
      return
    }

    // console.log(`mouse down \nmouseX: ${event.x}; mouseY: ${event.y}`)
    this._displayPoint.x = event.x
    this._displayPoint.y = event.y

    if (inputModifiers.selectingMode && event.shiftKey) {
      this._inputEventManager.triggerEventSelectionContinueMouse()
    }

    this._inputEventManager.triggerEventChangeTextCursorPosition(this._displayPoint)

    if (inputModifiers.selectingMode && !event.ctrlKey && !event.shiftKey) {
      this._inputEventManager.triggerEventSelectionDeleteAll()
    }

    if (!event.shiftKey) {
      this._inputEventManager.triggerEventSelectionStartMouse()
    }

    if (this._contextualMenu.isActive()) {
      this._contextualMenu.removeContext()
    }
  }

  private _handlerMouseMove (payload: IInputEventHandlerPayload<MouseEvent>): void {
    const { event, inputModifiers } = payload
    if (inputModifiers.selectingModeMouse) {
      // console.log(`mouse selection \nmouseX: ${this._displayPoint.x}; mouseY: ${this._displayPoint.y}`, '\nevent: ', event)
      this._displayPoint.x = event.x
      this._displayPoint.y = event.y

      this._inputEventManager.triggerEventChangeTextCursorPosition(this._displayPoint)
    }
  }

  private _handlerMouseUp (payload: IInputEventHandlerPayload<MouseEvent>): void {
    const { event, inputModifiers } = payload

    this._displayPoint.x = event.x
    this._displayPoint.y = event.y

    if (inputModifiers.selectingModeMouse) {
      this._inputEventManager.triggerEventChangeTextCursorPosition(this._displayPoint)
      this._inputEventManager.triggerEventSelectionEndMouse()
    }
    console.log('mouse up')
  }

  private _handlerContextualMenu (payload: IInputEventHandlerPayload<MouseEvent>): void {
    const { event } = payload
    this._displayPoint.x = event.x
    this._displayPoint.y = event.y
    // console.log(`context menu on x: ${event.x}; y: ${event.y}`)
    this._contextualMenu.toggleActiveState()
    if (this._contextualMenu.isActive()) {
      this._inputEventManager.showInteractiveElement(
        new Point(event.x, event.y),
        new InteractiveHtmlElement(this._contextualMenu.getContext())
      )
    } else {
      this._contextualMenu.removeContext()
    }
  }

  setInputEventManager (inputEventManager: IInputEventManager): void {
    inputEventManager.subscribeToEvent('mousedown', this._handlerMouseDown.bind(this))
    inputEventManager.subscribeToEvent('mousemove', this._handlerMouseMove.bind(this))
    inputEventManager.subscribeToEvent('mouseup', this._handlerMouseUp.bind(this))
    inputEventManager.subscribeToEvent('contextmenu', this._handlerContextualMenu.bind(this))

    this._contextualMenu.setInputEventManager(inputEventManager)

    this._inputEventManager = inputEventManager
  }
}

export { Mouse }
