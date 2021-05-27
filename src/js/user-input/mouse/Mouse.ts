import { MouseContextualMenu } from './MouseContextualMenu'
import { IInputEventManager } from '../IInputEventManager'
import { IInputEventHandlerPayload } from '../IInputEventHandlerPayload'
import { IPoint } from '../../common/IPoint'

class Mouse {
  private _inputEventManager: IInputEventManager
  private _displayPoint: IPoint
  private _mouseSelection: boolean
  private readonly _contextualMenu: MouseContextualMenu

  constructor () {
    this._displayPoint = { x: 0, y: 0 }
    this._contextualMenu = new MouseContextualMenu()
  }

  private _handlerMouseDown (payload: IInputEventHandlerPayload<MouseEvent>): void {
    console.log('mouse down')
    this._inputEventManager.triggerEventChangeTextCursorPosition({ x: payload.event.x, y: payload.event.y })

    this._displayPoint.x = payload.event.x
    this._displayPoint.y = payload.event.y
    this._mouseSelection = true

    if (this._contextualMenu.isActive()) {
      this._contextualMenu.removeContext()
    }
  }

  private _handlerMouseMove (payload: IInputEventHandlerPayload<MouseEvent>): void {
    if (this._mouseSelection) {
      console.log(`mouseX: ${this._displayPoint.x}; mouseY: ${this._displayPoint.y}`, '\nevent: ', payload.event)
    }
  }

  private _handlerMouseUp (payload: IInputEventHandlerPayload<MouseEvent>): void {
    this._displayPoint.x = payload.event.x
    this._displayPoint.y = payload.event.y
    this._mouseSelection = false
    console.log('mouse up')
  }

  private _handlerContextualMenu (payload: IInputEventHandlerPayload<MouseEvent>): void {
    this._displayPoint.x = payload.event.x
    this._displayPoint.y = payload.event.y
    console.log(`context menu on x: ${payload.event.x}; y: ${payload.event.y}`)
    this._inputEventManager.showUiElementOnInteractiveContext({ x: payload.event.x, y: payload.event.y }, this._contextualMenu.getContext())
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
