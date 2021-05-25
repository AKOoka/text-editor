import '../scss/main.scss'
import { CommandDispatcher } from './command-pipeline/CommandDispatcher'
import { HistoryCommandDispatcher } from './command-pipeline/HistoryCommandDispatcher'
import { TextArea } from './visualization/TextArea'
import { ICommandDispatcher } from './command-pipeline/ICommandDispatcher'
import { Keyboard } from './user-input/keyboard/Keyboard'
import { ITextEditor } from './core/ITextEditor'
import { TextEditor } from './core/TextEditor'
import { HtmlUi } from './user-input/HtmlUi'
import { AddTextStyleCommand } from './command-pipeline/commands/AddTextStyleCommand'
import { AddSelectionCommand } from './command-pipeline/commands/AddSelectionCommand'
import { ClearSelectionsCommand } from './command-pipeline/commands/ClearSelectionsCommand'
import { Mouse } from './user-input/mouse/Mouse'
import { IInputEventManager } from './user-input/IInputEventManager'
import { InputEventManager } from './user-input/InputEventManager'

const textEditor: ITextEditor = new TextEditor()
const commandDispatcher: ICommandDispatcher = new CommandDispatcher(textEditor)
const historyCommandDispatcher: HistoryCommandDispatcher = new HistoryCommandDispatcher(commandDispatcher)
const textArea: TextArea = new TextArea()
const inputEventManager: IInputEventManager = new InputEventManager(textArea, commandDispatcher)
const keyboard: Keyboard = new Keyboard()
const htmlUi = new HtmlUi()
const mouse: Mouse = new Mouse()

htmlUi.createButton('bold', 'bold', () => {
  historyCommandDispatcher.doCommand(new AddTextStyleCommand('bold', true))
})
htmlUi.createButton('underline', 'underline', () => {
  historyCommandDispatcher.doCommand(new AddTextStyleCommand('underline', true))
})
htmlUi.createButton('addSelection', 'addSelection', () => {
  historyCommandDispatcher.doCommand(new AddSelectionCommand({ startX: 0, endX: 5, startY: 0, endY: 0 }, false))
})
htmlUi.createButton('addSecondSelection', 'addSecondSelection', () => {
  historyCommandDispatcher.doCommand(new AddSelectionCommand({ startX: 2, endX: 7, startY: 0, endY: 0 }, false))
})
htmlUi.createButton('clearSelection', 'clearSelection', () => {
  historyCommandDispatcher.doCommand(new ClearSelectionsCommand(false))
})
htmlUi.createButton('undo', 'undo', () => {
  historyCommandDispatcher.undoCommand()
})
htmlUi.createButton('redo', 'redo', () => {
  historyCommandDispatcher.redoCommand()
})

document.getElementById('text-editor')?.append(htmlUi.getContext(), textArea.getContext())

textEditor.subscribeForTextCursorPosition(textArea)
textEditor.subscribeForTextCursorSelections(textArea)
textEditor.subscribeForTextRepresentation(textArea)
textEditor.subscribeForActiveStyles(htmlUi)
textEditor.init()

textArea.init()

keyboard.setContext(inputEventManager)
mouse.setContext(inputEventManager)

export { textEditor }
