import '../scss/main.scss'
import { CommandDispatcher } from './command-pipeline/CommandDispatcher'
import { HistoryCommandDispatcher } from './command-pipeline/HistoryCommandDispatcher'
import { TextArea } from './visualization/TextArea'
import { Keyboard } from './user-input/keyboard/Keyboard'
import { ITextEditor } from './core/ITextEditor'
import { TextEditor } from './core/TextEditor'
import { HtmlUi } from './user-input/HtmlUi'
import { Mouse } from './user-input/mouse/Mouse'
import { IInputEventManager } from './user-input/IInputEventManager'
import { InputEventManager } from './user-input/InputEventManager'
import { ICommandDispatcher } from './command-pipeline/ICommandDispatcher'

const textEditor: ITextEditor = new TextEditor()
const textEditorContext: HTMLElement = textEditor.getContext()
const historyCommandDispatcher: ICommandDispatcher = new HistoryCommandDispatcher(new CommandDispatcher(textEditor))
const textArea: TextArea = new TextArea()
const inputEventManager: IInputEventManager = new InputEventManager(textArea, historyCommandDispatcher)
const keyboard: Keyboard = new Keyboard()
const htmlUi = new HtmlUi()
const mouse: Mouse = new Mouse()

textEditorContext.append(htmlUi.getContext(), textArea.getContext())
document.body.append(textEditorContext)

textEditor.subscribeForTextCursorPosition(textArea)
textEditor.subscribeForTextCursorSelections(textArea)
textEditor.subscribeForTextRepresentation(textArea)
textEditor.subscribeForActiveStyles(htmlUi)
textEditor.init()

textArea.init()

keyboard.setInputEventManager(inputEventManager)
mouse.setInputEventManager(inputEventManager)
htmlUi.setInputEventManager(inputEventManager)

export { textEditor }
