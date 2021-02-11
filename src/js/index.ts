import '../scss/main.scss'
import { RemoveDirection } from './RemoveDirection'

import { TextEditor } from './TextEditor'

const textEditor: TextEditor = new TextEditor()

textEditor.addText('lox, pidor')

console.log(textEditor.cursor.getStart(), textEditor.cursor.getEnd())
textEditor.removeText(RemoveDirection.Backward)
textEditor.removeText(RemoveDirection.Backward)
console.log(textEditor.cursor.getStart(), textEditor.cursor.getEnd())
textEditor.setCursorPos(1, textEditor.cursor.getEnd(), textEditor.cursor.getLinePosition())
textEditor.removeText()
console.log(textEditor.cursor.getStart(), textEditor.cursor.getEnd())

textEditor.addTextStyle('bold')
console.log(textEditor)
console.log(textEditor.textRepresentation.getLine(0).getText(), textEditor.textRepresentation.getLine(0).getStyles())

export {}
