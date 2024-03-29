import '../scss/main.scss'
import { CommandDispatcher } from './command-pipeline/CommandDispatcher'
import { HistoryCommandDispatcher } from './command-pipeline/HistoryCommandDispatcher'
import { TextArea } from './visualization/TextArea'
import { Keyboard } from './user-input/keyboard/Keyboard'
import { ITextEditor } from './core/ITextEditor'
import { TextEditor } from './core/TextEditor'
import { UiMenu } from './user-input/ui-menu/UiMenu'
import { Mouse } from './user-input/mouse/Mouse'
import { InputEventManager } from './user-input/InputEventManager'
import { ICommandDispatcher } from './command-pipeline/ICommandDispatcher'

const textEditor: ITextEditor = new TextEditor()
const textEditorHtmlContext: HTMLElement = textEditor.getHtmlContext()
const historyCommandDispatcher: ICommandDispatcher = new HistoryCommandDispatcher(new CommandDispatcher(textEditor))
const textArea: TextArea = new TextArea()
const inputEventManager: InputEventManager = new InputEventManager(textArea, historyCommandDispatcher)
const keyboard: Keyboard = new Keyboard()
const htmlUi: UiMenu = new UiMenu()
const mouse: Mouse = new Mouse()
const textEditorHtmlContextBody: HTMLElement = document.createElement('div')

textEditorHtmlContextBody.classList.add('text-editor-body')
textEditorHtmlContextBody.append(textArea.getContext(), inputEventManager.getHtmlContext())
textEditorHtmlContext.append(htmlUi.getContext(), textEditorHtmlContextBody)
document.body.append(textEditorHtmlContext)

textArea.init()

textEditor.subscribeForTextCursorPoint(textArea)
textEditor.subscribeForTextCursorPoint(inputEventManager)

textEditor.subscribeForTextCursorSelections(textArea)

textEditor.subscribeForTextRepresentation(textArea)

textEditor.subscribeForActiveStyles(htmlUi)

keyboard.setInputEventManager(inputEventManager)
mouse.setInputEventManager(inputEventManager)
htmlUi.setInputEventManager(inputEventManager)

textEditor.init()

export {}
