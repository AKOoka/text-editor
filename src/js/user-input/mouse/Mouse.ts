import { MouseContextualMenu } from './MouseContextualMenu'
import { IInputEventManager } from '../IInputEventManager'
import { IInputEventHandlerPayload } from '../IInputEventHandlerPayload'

class Mouse {
  private _context: IInputEventManager
  private _displayX: number
  private _displayY: number
  private _mouseSelection: boolean
  private readonly _contextualMenu: MouseContextualMenu

  constructor () {
    this._displayX = 0
    this._displayY = 0
    this._contextualMenu = new MouseContextualMenu()
  }

  private _handlerMouseDown (payload: IInputEventHandlerPayload<MouseEvent>): void {
    console.log('mouse down')
    this._context.triggerEventChangeTextCursorPosition(payload.event.offsetX, payload.event.offsetY)

    this._displayX = payload.event.offsetX
    this._displayY = payload.event.offsetY
    this._mouseSelection = true

    if (this._contextualMenu.isActive()) {
      this._contextualMenu.removeContext()
    }
  }

  private _handlerMouseMove (payload: IInputEventHandlerPayload<MouseEvent>): void {
    if (this._mouseSelection) {
      console.log(`mouseX: ${payload.event.offsetX}; mouseY: ${payload.event.offsetY}`)
    }
  }

  private _handlerMouseUp (payload: IInputEventHandlerPayload<MouseEvent>): void {
    this._displayX = payload.event.offsetX
    this._displayY = payload.event.offsetY
    this._mouseSelection = false
    console.log('mouse up')
  }

  private _handlerContextualMenu (payload: IInputEventHandlerPayload<MouseEvent>): void {
    this._displayX = payload.event.offsetX
    this._displayY = payload.event.offsetY
    console.log(`context menu on x: ${payload.event.x}; y: ${payload.event.y}`)
    payload.event.preventDefault()

    this._contextualMenu.setPosition(this._displayX, this._displayY)
    this._context.showUiElement(this._contextualMenu.getContext())
    this._contextualMenu.setActiveState(true)
  }

  setContext (context: IInputEventManager): void {
    context.subscribeToEvent('mousedown', this._handlerMouseDown.bind(this))
    context.subscribeToEvent('mousemove', this._handlerMouseMove.bind(this))
    context.subscribeToEvent('mouseup', this._handlerMouseUp.bind(this))
    context.subscribeToEvent('contextmenu', this._handlerContextualMenu.bind(this))

    this._contextualMenu.init(context)

    this._context = context
  }
}

export { Mouse }
