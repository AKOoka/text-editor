import '../scss/main.scss'
import { CommandDispatcher } from './command-pipeline/CommandDispatcher'
import { HistoryCommandDispatcher } from './command-pipeline/HistoryCommandDispatcher'
import { HtmlTextArea } from './visualization/HtmlTextArea'
import { ICommandDispatcher } from './command-pipeline/ICommandDispatcher'
import { IoDevice } from './user-input-handler/IoDevice'
import { ITextCursor } from './core/ITextCursor'
import { ITextEditor } from './core/ITextEditor'
import { ITextRepresentation } from './core/ITextRepresentation'
import { TextCursor } from './core/TextCursor'
import { TextEditor } from './core/TextEditor'
import { TextRepresentation } from './core/TextRepresentation'
import { HtmlUi } from './user-input-handler/HtmlUi'
import { AddTextStyleCommand } from './command-pipeline/commands/AddTextStyleCommand'
import { AddSelectionCommand } from './command-pipeline/commands/AddSelectionCommand'
import { ClearSelectionsCommand } from './command-pipeline/commands/ClearSelectionsCommand'
import { TypeKeysHandler } from './user-input-handler/KeysHandlers/TypeKeysHandler'
import { DeleteKeysHandler } from './user-input-handler/KeysHandlers/DeleteKeysHandler'
import { ArrowKeysHandler } from './user-input-handler/KeysHandlers/ArrowKeysHandler'
import { AddLineKeysHandler } from './user-input-handler/KeysHandlers/AddLineKeysHandler'

const textCursor: ITextCursor = new TextCursor()
const textRepresentation: ITextRepresentation = new TextRepresentation()
const textEditor: ITextEditor = new TextEditor(textCursor, textRepresentation)
const commandDispatcher: ICommandDispatcher = new CommandDispatcher(textEditor)
const historyCommandDispatcher: HistoryCommandDispatcher = new HistoryCommandDispatcher(commandDispatcher)
const ioDevice: IoDevice = new IoDevice(document, historyCommandDispatcher)
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

ioDevice.addKeysHandler(new TypeKeysHandler())
ioDevice.addKeysHandler(new DeleteKeysHandler())
ioDevice.addKeysHandler(new ArrowKeysHandler())
ioDevice.addKeysHandler(new AddLineKeysHandler())
ioDevice.setHandlersOnKeyDown()

document.getElementById('text-editor')?.append(htmlUi.getContext(), htmlTextArea.getContext())

export { textCursor, textRepresentation, textEditor }
