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
import { TypeKeysHandler } from './user-input-handler/TypeKeysHandler'
import { DeleteKeysHandler } from './user-input-handler/DeleteKeysHandler'
import { ArrowKeysHandler } from './user-input-handler/ArrowKeysHandler'
import { NodeStyleContainer } from './core/NodeStyleContainer'
import { NodeText } from './core/NodeText'

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
ioDevice.setHandlersOnKeyDown()

document.getElementById('text-editor')?.append(htmlUi.getContext(), htmlTextArea.getContext())

const nsc = new NodeStyleContainer('bold', [new NodeText('lorem'), new NodeText('ipsun'), new NodeText('foo')])
// nsc.removeText(0, 'lorem'.length, 'lorem'.length + 'ipsun'.length)
nsc.addTextStyle('italic', 0, 2, 2 + 'lorem'.length)

export { textCursor, textRepresentation, textEditor }
