import { CommandTextStyleAdd } from '../../command-pipeline/commands/CommandTextStyleAdd'
import { TextStyleUnique } from '../../common/TextStyleUnique'
import { IInputEventManager } from '../IInputEventManager'
import { BaseUiMenuOptionSelection } from './BaseUiMenuOptionSelection'

export class UiMenuSelect {
  private readonly _context: HTMLElement
  private readonly _inputEventManager: IInputEventManager
  private readonly _options: BaseUiMenuOptionSelection

  constructor (inputEventManager: IInputEventManager, text: string, popupText: string, options: BaseUiMenuOptionSelection) {
    this._inputEventManager = inputEventManager

    this._options = options
    this._options.setOptionPickTrigger(this._optionPickTrigger.bind(this))

    this._context = document.createElement('button')
    this._context.textContent = text
    this._context.title = popupText
    this._context.append(this._options.context)
    this._context.onclick = () => this._options.toggleOptions()
  }

  get context (): HTMLElement {
    return this._context
  }

  private _optionPickTrigger (value: string): void {
    this._inputEventManager.triggerEventDoCommand(new CommandTextStyleAdd(new TextStyleUnique('font-family', value), true))
  }
}
