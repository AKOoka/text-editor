import { UiMenuOptionsPickTrigger } from './BaseUiMenuOptionSelection'

export class UiMenuOption {
  private readonly _context: HTMLElement
  private readonly _value: string

  constructor (contextType: keyof HTMLElementTagNameMap, description: string, value: string) {
    this._value = value
    this._context = document.createElement(contextType)
    this._context.textContent = description
  }

  get context (): HTMLElement {
    return this._context
  }

  get value (): string {
    return this._value
  }

  setPickTrigger (pickTrigger: UiMenuOptionsPickTrigger): void {
    this._context.onclick = () => pickTrigger(this._value)
  }
}
