import { IActiveTextStylesSubscriber } from '../../common/IActiveTextStylesSubscriber'
import { CommandTextStyleAdd } from '../../command-pipeline/commands/CommandTextStyleAdd'
import { IInputEventManager } from '../IInputEventManager'
import { InputEventHandler } from '../InputEventManager'
import { CommandTextStyleDeleteAll } from '../../command-pipeline/commands/CommandTextStyleDeleteAll'
import { TextStyle } from '../../common/TextStyle'
import { TextStyleUnique } from '../../common/TextStyleUnique'

interface IUiButtonConfig {
  type: string
  popupText: string
  handler: InputEventHandler
}

const uiButtonConfigs: IUiButtonConfig[] = [
  { type: 'bold', popupText: 'bold', handler: ({ commandDispatcher }) => commandDispatcher.doCommand(new CommandTextStyleAdd(new TextStyleUnique('font-weight', 'bold'), true)) },
  { type: 'underline', popupText: 'underline', handler: ({ commandDispatcher }) => commandDispatcher.doCommand(new CommandTextStyleAdd(new TextStyleUnique('text-decoration', 'underline'), true)) },
  { type: 'italic', popupText: 'italic', handler: ({ commandDispatcher }) => commandDispatcher.doCommand(new CommandTextStyleAdd(new TextStyleUnique('font-style', 'italic'), true)) },
  { type: 'clear styles', popupText: 'clear styles', handler: ({ commandDispatcher }) => commandDispatcher.doCommand(new CommandTextStyleDeleteAll(true)) },
  { type: 'undo', popupText: 'undo', handler: ({ commandDispatcher }) => commandDispatcher.undoCommand() },
  { type: 'redo', popupText: 'redo', handler: ({ commandDispatcher }) => commandDispatcher.redoCommand() }
]

export class UiMenu implements IActiveTextStylesSubscriber {
  private readonly _context: HTMLElement
  private readonly _buttons: Map<TextStyle, HTMLElement>
  private _inputEventManager: IInputEventManager

  constructor () {
    this._context = document.createElement('div')
    this._context.classList.add('ui')
    this._buttons = new Map()
  }

  private _createHtmlButton (popupText: string): HTMLElement {
    const button = document.createElement('button')
    button.classList.add('ui-button')
    button.textContent = popupText
    button.title = popupText
    return button
  }

  setInputEventManager (inputEventManager: IInputEventManager): void {
    this._inputEventManager = inputEventManager

    for (const { popupText, handler } of uiButtonConfigs) {
      const newButton: HTMLElement = this._createHtmlButton(popupText)
      // this._buttons.set(type, newButton)
      this._context.append(newButton)
      this._inputEventManager.subscribeToEvent('click', handler, newButton)
    }
  }

  getContext (): HTMLElement {
    return this._context
  }

  updateActiveTextStyles (activeTextStyles: TextStyle[]): void {
    for (const [buttonType, button] of this._buttons.entries()) {
      if (activeTextStyles.includes(buttonType)) {
        button.classList.add('button-active')
        continue
      }
      button.classList.remove('button-active')
    }
  }
}
