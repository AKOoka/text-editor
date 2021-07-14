import { BaseUiMenuOptionSelection } from './BaseUiMenuOptionSelection'
import { UiMenuOption } from './UiMenuOption'

export class UiMenuOptionList extends BaseUiMenuOptionSelection {
  constructor () {
    super('div')
    const option = new UiMenuOption('button', 'Comic Sans', '"Comic Sans MS", "Comic Sans"')
    this._context.append(option.context)
    this._options.push(option)
  }
}
