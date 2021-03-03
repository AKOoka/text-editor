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
import { HtmlUi } from './visualization/HtmlUi'
import { AddTextStyleCommand } from './commandPipeline/AddTextStyleCommand'
import { AddSelectionCommand } from './commandPipeline/AddSelectionCommand'
import { ClearSelectionsCommand } from './commandPipeline/ClearSelectionsCommand'

const textCursor: ITextCursor = new TextCursor()
const textRepresentation: ITextRepresentation = new TextRepresentation()
const textEditor: ITextEditor = new TextEditor(textCursor, textRepresentation)
const commandDispatcher: ICommandDispatcher = new CommandDispatcher(textEditor)
const historyCommandDispatcher: HistoryCommandDispatcher = new HistoryCommandDispatcher(commandDispatcher)
const ioDevice: IoDevice = new IoDevice(historyCommandDispatcher)
const htmlTextArea = new HtmlTextArea()
const htmlUi = new HtmlUi()

htmlUi.createButton('bold', 'bold', () => {
  historyCommandDispatcher.doCommand(new AddTextStyleCommand('bold', true))
})
htmlUi.createButton('underline', 'underline', () => {
  historyCommandDispatcher.doCommand(new AddTextStyleCommand('underline', true))
})
htmlUi.createButton('addSelection', 'addSelection', () => {
  historyCommandDispatcher.doCommand(new AddSelectionCommand({ start: 0, end: 5, startLinePosition: 0, endLinePosition: 0 }, false))
})
htmlUi.createButton('addSecondSelection', 'addSecondSelection', () => {
  historyCommandDispatcher.doCommand(new AddSelectionCommand({ start: 2, end: 7, startLinePosition: 0, endLinePosition: 0 }, false))
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

textCursor.subscribe(htmlTextArea)

textRepresentation.subscribe(htmlUi)
textRepresentation.subscribe(htmlTextArea)
textRepresentation.createNewLines(0, 1)
textRepresentation.updateSubscribers()

ioDevice.setHandlersOnKeyDown()

document.getElementById('text-editor')?.append(htmlUi.getContext(), htmlTextArea.getContext())

export { textCursor, textRepresentation, textEditor }
