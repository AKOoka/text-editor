import { IActiveTextStylesSubscriber } from '../../common/IActiveTextStylesSubscriber'
import { CommandTextStyleAdd } from '../../command-pipeline/commands/CommandTextStyleAdd'
import { IInputEventManager, InputEventHandler } from '../IInputEventManager'
import { CommandTextStyleDeleteAll } from '../../command-pipeline/commands/CommandTextStyleDeleteAll'
import { TextStyle } from '../../common/TextStyle'
import { UiMenuButton } from './UiMenuButton'
import { UiMenuSelect } from './UiMenuSelect'
import { UiMenuOptionList } from './UiMenuOptionList'

interface IUiButtonConfig {
  type: string
  popupText: string
  handler: InputEventHandler
}

const uiButtonConfigs: IUiButtonConfig[] = [
  { type: 'bold', popupText: 'bold', handler: ({ inputEventManager }) => inputEventManager.triggerEventDoCommand(new CommandTextStyleAdd(new TextStyle('font-weight', 'bold'), true)) },
  { type: 'underline', popupText: 'underline', handler: ({ inputEventManager }) => inputEventManager.triggerEventDoCommand(new CommandTextStyleAdd(new TextStyle('text-decoration', 'underline'), true)) },
  { type: 'italic', popupText: 'italic', handler: ({ inputEventManager }) => inputEventManager.triggerEventDoCommand(new CommandTextStyleAdd(new TextStyle('font-style', 'italic'), true)) },
  { type: 'clear styles', popupText: 'clear styles', handler: ({ inputEventManager }) => inputEventManager.triggerEventDoCommand(new CommandTextStyleDeleteAll(true)) },
  { type: 'undo', popupText: 'undo', handler: ({ inputEventManager }) => inputEventManager.triggerEventUndoCommand() },
  { type: 'redo', popupText: 'redo', handler: ({ inputEventManager }) => inputEventManager.triggerEventRedoCommand() }
]

export class UiMenu implements IActiveTextStylesSubscriber {
  private readonly _htmlContext: HTMLElement
  private readonly _buttons: Map<TextStyle, UiMenuButton>
  private _inputEventManager: IInputEventManager

  constructor () {
    this._htmlContext = this._createHtmlContext()
    this._buttons = new Map()
  }

  private _createHtmlContext (): HTMLElement {
    const htmlContext: HTMLElement = document.createElement('div')
    htmlContext.classList.add('text-editor-ui')
    return htmlContext
  }

  setInputEventManager (inputEventManager: IInputEventManager): void {
    this._inputEventManager = inputEventManager

    for (const { popupText, handler } of uiButtonConfigs) {
      const newButton: UiMenuButton = new UiMenuButton(popupText, popupText)
      // this._buttons.set(type, newButton)
      this._htmlContext.append(newButton.context)
      this._inputEventManager.subscribeToEvent('click', handler, newButton.context)
    }

    this._htmlContext.append(new UiMenuSelect(this._inputEventManager, 'font', 'select font', new UiMenuOptionList()).context)
  }

  getContext (): HTMLElement {
    return this._htmlContext
  }

  updateActiveTextStyles (activeTextStyles: TextStyle[]): void {
    for (const [buttonType, button] of this._buttons.entries()) {
      button.setActiveState(activeTextStyles.includes(buttonType))
    }
  }
}
