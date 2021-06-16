import { IInputEventManager } from '../IInputEventManager'
import { InputEventHandler } from '../InputEventManager'

class MouseContextualMenu {
  private readonly _context: HTMLElement
  private _isActive: boolean

  constructor () {
    this._context = document.createElement('div')
    this._context.classList.add('mouse-contextual-menu')
  }

  private _createButtonEventHandler (handler: InputEventHandler): InputEventHandler {
    return (payload) => {
      console.log('context menu click')
      this.removeContext()
      handler(payload)
    }
  }

  private _createButton (buttonText: string): HTMLButtonElement {
    const button: HTMLButtonElement = document.createElement('button')
    button.classList.add('mouse-contextual-menu_button')
    button.append(buttonText)
    return button
  }

  getContext (): HTMLElement {
    return this._context
  }

  isActive (): boolean {
    return this._isActive
  }

  setActiveState (state: boolean): void {
    this._isActive = state
  }

  setInputEventManager (inputEventManager: IInputEventManager): void {
    const copyButton: HTMLButtonElement = this._createButton('copy')
    const pasteButton: HTMLButtonElement = this._createButton('paste')

    this._context.append(copyButton)
    this._context.append(pasteButton)

    inputEventManager.subscribeToEvent(
      'mousedown',
      this._createButtonEventHandler(() => {}),
      copyButton
    )
    inputEventManager.subscribeToEvent(
      'mousedown',
      this._createButtonEventHandler(() => {}),
      pasteButton
    )
  }

  removeContext (): void {
    this._context.remove()
    this._isActive = false
  }

  setPosition (x: number, y: number): void {
    this._context.style.left = `${x}px`
    this._context.style.top = `${y}px`
  }
}

export { MouseContextualMenu }
