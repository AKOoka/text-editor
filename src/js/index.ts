import '../scss/main.scss'
import { CommandDispatcher } from './command-pipeline/CommandDispatcher'
import { HistoryCommandDispatcher } from './command-pipeline/HistoryCommandDispatcher'
import { TextArea } from './visualization/TextArea'
import { ICommandDispatcher } from './command-pipeline/ICommandDispatcher'
import { IoDevice } from './user-input/IoDevice'
import { ITextCursor } from './core/ITextCursor'
import { ITextEditor } from './core/ITextEditor'
import { ITextRepresentation } from './core/TextRepresentation/ITextRepresentation'
import { TextCursor } from './core/TextCursor'
import { TextEditor } from './core/TextEditor'
import { TextRepresentation } from './core/TextRepresentation/TextRepresentation'
import { HtmlUi } from './user-input/HtmlUi'
import { AddTextStyleCommand } from './command-pipeline/commands/AddTextStyleCommand'
import { AddSelectionCommand } from './command-pipeline/commands/AddSelectionCommand'
import { ClearSelectionsCommand } from './command-pipeline/commands/ClearSelectionsCommand'
import { TypeKeysHandler } from './user-input/KeysHandlers/TypeKeysHandler'
import { DeleteKeysHandler } from './user-input/KeysHandlers/DeleteKeysHandler'
import { ArrowKeysHandler } from './user-input/KeysHandlers/ArrowKeysHandler'
import { AddLineKeysHandler } from './user-input/KeysHandlers/AddLineKeysHandler'

const textCursor: ITextCursor = new TextCursor()
const textRepresentation: ITextRepresentation = new TextRepresentation()
const textEditor: ITextEditor = new TextEditor(textCursor, textRepresentation)
const commandDispatcher: ICommandDispatcher = new CommandDispatcher(textEditor)
const historyCommandDispatcher: HistoryCommandDispatcher = new HistoryCommandDispatcher(commandDispatcher)
const ioDevice: IoDevice = new IoDevice(document, historyCommandDispatcher)
const htmlTextArea = new TextArea()
const htmlUi = new HtmlUi()

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
