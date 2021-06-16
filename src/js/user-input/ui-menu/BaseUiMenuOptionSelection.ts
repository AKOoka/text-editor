import { UiMenuOption } from './UiMenuOption'

export type UiMenuOptionsPickTrigger = (value: string) => void

export abstract class BaseUiMenuOptionSelection {
  protected readonly _context: HTMLElement
  protected _options: UiMenuOption[]

  constructor (contextType: keyof HTMLElementTagNameMap) {
    this._context = document.createElement(contextType)
    this._context.style.display = 'none'
    this._options = []
  }

  get context (): HTMLElement {
    return this._context
  }

  setOptionPickTrigger (trigger: UiMenuOptionsPickTrigger): void {
    for (const o of this._options) {
      o.setPickTrigger(trigger)
    }
  }

  toggleOptions (): void {
    this._context.style.display = this._context.style.display === 'none' ? 'block' : 'none'
  }
}
