import { IPoint } from '../../common/IPoint'
import { IInputEventManager } from '../IInputEventManager'
import { IInputEventHandlerPayload } from '../InputEventManager'
import { MouseContextualMenu } from './MouseContextualMenu'

class Mouse {
  private _inputEventManager: IInputEventManager
  private _displayPoint: IPoint
  private readonly _contextualMenu: MouseContextualMenu

  constructor () {
    this._displayPoint = { x: 0, y: 0 }
    this._contextualMenu = new MouseContextualMenu()
  }

  private _handlerMouseDown (payload: IInputEventHandlerPayload<MouseEvent>): void {
    const { event } = payload
    // console.log(`mouse down \nmouseX: ${event.x}; mouseY: ${event.y}`)
    this._inputEventManager.triggerEventChangeTextCursorPosition({ x: event.x, y: event.y })

    this._displayPoint.x = event.x
    this._displayPoint.y = event.y

    if (!event.ctrlKey) {
      this._inputEventManager.triggerEventSelectionDeleteAll()
    }

    this._inputEventManager.triggerEventSelectionStartMouse(this._displayPoint)

    if (this._contextualMenu.isActive()) {
      this._contextualMenu.removeContext()
    }
  }

  private _handlerMouseMove (payload: IInputEventHandlerPayload<MouseEvent>): void {
    const { event, inputModifiers } = payload
    if (inputModifiers.selecting) {
      // console.log(`mouse selection \nmouseX: ${this._displayPoint.x}; mouseY: ${this._displayPoint.y}`, '\nevent: ', event)
      this._displayPoint.x = event.x
      this._displayPoint.y = event.y
      this._inputEventManager.triggerEventSelectionMoveMouse(this._displayPoint)
    }
  }

  private _handlerMouseUp (payload: IInputEventHandlerPayload<MouseEvent>): void {
    const { event, inputModifiers } = payload
    if (inputModifiers.selecting) {
      this._inputEventManager.triggerEventSelectionEnd()
    }

    this._displayPoint.x = event.x
    this._displayPoint.y = event.y
    console.log('mouse up')
  }

  private _handlerContextualMenu (payload: IInputEventHandlerPayload<MouseEvent>): void {
    this._displayPoint.x = payload.event.x
    this._displayPoint.y = payload.event.y
    // console.log(`context menu on x: ${payload.event.x}; y: ${payload.event.y}`)
    this._inputEventManager.showInteractiveElement({ x: payload.event.x, y: payload.event.y }, this._contextualMenu.getContext())
    this._contextualMenu.setActiveState(true)
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
