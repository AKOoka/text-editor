import { TextStyleType } from '../../common/TextStyleType'
import { IActiveTextStylesSubscriber } from '../../common/IActiveTextStylesSubscriber'
import { CommandTextStyleAdd } from '../../command-pipeline/commands/CommandTextStyleAdd'
// import { CommandSelectionAdd } from '../../command-pipeline/commands/CommandSelectionAdd'
import { CommandSelectionsClear } from '../../command-pipeline/commands/CommandSelectionsClear'
import { IInputEventManager } from '../IInputEventManager'
import { InputEventHandler } from '../InputEventHandler'

interface IUiButtonConfig {
  type: string
  popupText: string
  handler: InputEventHandler
}

const uiButtonConfigs: IUiButtonConfig[] = [
  { type: 'bold', popupText: 'bold', handler: ({ commandDispatcher }) => commandDispatcher.doCommand(new CommandTextStyleAdd('bold', true)) },
  { type: 'underline', popupText: 'underline', handler: ({ commandDispatcher }) => commandDispatcher.doCommand(new CommandTextStyleAdd('underline', true)) },
  // { type: 'add selection', popupText: 'add selection', handler: ({ commandDispatcher }) => commandDispatcher.doCommand(new CommandSelectionAdd({ x: 0, endX: 5, y: 0, endY: 0 }, false)) },
  // { type: 'add second selection', popupText: 'add second selection', handler: ({ commandDispatcher }) => commandDispatcher.doCommand(new CommandSelectionAdd({ x: 2, endX: 7, y: 0, endY: 0 }, false)) },
  { type: 'clear selections', popupText: 'clear selections', handler: ({ commandDispatcher }) => commandDispatcher.doCommand(new CommandSelectionsClear(false)) },
  { type: 'undo', popupText: 'undo', handler: ({ commandDispatcher }) => commandDispatcher.undoCommand() },
  { type: 'redo', popupText: 'redo', handler: ({ commandDispatcher }) => commandDispatcher.redoCommand() }
]

class UiMenu implements IActiveTextStylesSubscriber {
  private readonly _context: HTMLElement
  private readonly _buttons: Map<string, HTMLElement>
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

    for (const { type, popupText, handler } of uiButtonConfigs) {
      const newButton: HTMLElement = this._createHtmlButton(popupText)
      this._buttons.set(type, newButton)
      this._context.append(newButton)
      this._inputEventManager.subscribeToEvent('click', handler, newButton)
    }
  }

  getContext (): HTMLElement {
    return this._context
  }

  updateActiveTextStyles (activeTextStyles: TextStyleType[]): void {
    for (const [buttonType, button] of this._buttons.entries()) {
      if (activeTextStyles.includes(buttonType as TextStyleType)) {
        button.classList.add('button-active')
        continue
      }
      button.classList.remove('button-active')
    }
  }
}

export { UiMenu }
