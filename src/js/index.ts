import '../scss/main.scss'
import { CommandDispatcher } from './commandPipeline/CommandDispatcher'
import { HistoryCommandDispatcher } from './commandPipeline/HistoryCommandDispatcher'
import { HtmlTextArea } from './visualization/HtmlTextArea'
import { ICommandDispatcher } from './commandPipeline/ICommandDispatcher'
import { IoDevice } from './IoDevice'
import { ITextCursor } from './core/ITextCursor'
import { ITextEditor } from './core/ITextEditor'
import { ITextRepresentation } from './core/ITextRepresentation'
import { TextCursor } from './core/TextCursor'
import { TextEditor } from './core/TextEditor'
import { TextRepresentation } from './core/TextRepresentation'
import { AddTextStyleCommand } from './commandPipeline/AddTextStyleCommand'
import { AddSelectionCommand } from './commandPipeline/AddSelectionCommand'
import { ClearSelectionsCommand } from './commandPipeline/ClearSelectionsCommand'

const textCursor: ITextCursor = new TextCursor()
const textRepresentation: ITextRepresentation = new TextRepresentation()
const textEditor: ITextEditor = new TextEditor(textCursor, textRepresentation)
const commandDispatcher: ICommandDispatcher = new CommandDispatcher(textEditor)
const historyCommandDispatcher: HistoryCommandDispatcher = new HistoryCommandDispatcher(commandDispatcher)
const ioDevice: IoDevice = new IoDevice(historyCommandDispatcher)
const htmlContext = document.createElement('div')
const htmlTextArea = new HtmlTextArea(htmlContext)

textCursor.subscribe(htmlTextArea)

textRepresentation.subscribe(htmlTextArea)
textRepresentation.createNewLines(0, 1)
textRepresentation.updateSubscribers()

const boldButton = document.createElement('button')
boldButton.textContent = 'bold'
const underlineButton = document.createElement('button')
underlineButton.textContent = 'underline'
const addSelection = document.createElement('button')
addSelection.textContent = 'select'
const addSecondSelection = document.createElement('button')
addSecondSelection.textContent = 'second select'
const clearSelections = document.createElement('button')
clearSelections.textContent = 'clear selection'
const undoButton = document.createElement('button')
undoButton.textContent = 'undo'
const redoButton = document.createElement('button')
redoButton.textContent = 'redo'

boldButton.onclick = () => {
  historyCommandDispatcher.doCommand(new AddTextStyleCommand('bold', true))
}
underlineButton.onclick = () => {
  historyCommandDispatcher.doCommand(new AddTextStyleCommand('underline', true))
}
addSelection.onclick = () => {
  historyCommandDispatcher.doCommand(new AddSelectionCommand({ start: 0, end: 5, startLinePosition: 0, endLinePosition: 0 }, false))
}
addSecondSelection.onclick = () => {
  historyCommandDispatcher.doCommand(new AddSelectionCommand({ start: 2, end: 7, startLinePosition: 0, endLinePosition: 0 }, false))
}
clearSelections.onclick = () => {
  historyCommandDispatcher.doCommand(new ClearSelectionsCommand(false))
}
undoButton.onclick = () => {
  historyCommandDispatcher.undoCommand()
}
redoButton.onclick = () => {
  historyCommandDispatcher.redoCommand()
}

ioDevice.setHandlersOnKeyDown()

document.body.append(boldButton, underlineButton, addSelection, addSecondSelection, clearSelections, undoButton, redoButton)
document.getElementById('text-editor')?.append(htmlContext)

export { textCursor, textRepresentation, textEditor }
