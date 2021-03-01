/* global describe, test, expect, beforeAll, afterAll, beforeEach, afterEach  */

const { TextCursor } = require('../core/TextCursor')
const { TextRepresentation } = require('../core/TextRepresentation')
const { TextEditor } = require('../core/TextEditor')

const textCursor = new TextCursor()
const textRepresentation = new TextRepresentation()
textRepresentation.createNewLines(0, 10)

const textEditor = new TextEditor(
  textCursor,
  textRepresentation
)

describe('Managing cursor functionality', () => {
  beforeEach(() => {
    textCursor.setPos(0, 0, [])
    textCursor.clearSelections()
  })
  afterAll(() => {
    textCursor.setPos(0, 0, [])
    textCursor.clearSelections()
  })

  test('set text cursor on position: 4, line: 0', () => {
    textEditor.setTextCursorPos(4, 0)
    expect(textCursor.getPosition()).toBe(4)
    expect(textCursor.getLinePosition()).toBe(0)
  })

  test('move horizontaly cursor right by 2', () => {
    textEditor.horMoveTextCursor(2)
    expect(textCursor.getPosition()).toBe(2)
    expect(textCursor.getLinePosition()).toBe(0)
  })

  test('move verticaly cursor down by 3', () => {
    textEditor.verMoveTextCursor(3)
    expect(textCursor.getPosition()).toBe(0)
    expect(textCursor.getLinePosition()).toBe(3)
  })

  test('add cursor selection from position: 2, line: 0 to position: 10, line: 3', () => {
    textEditor.addSelection({ start: 2, startLinePosition: 0, end: 10, endLinePosition: 3 })
    const sel = textCursor.getSelections()[0]
    expect(sel.start).toBe(2)
    expect(sel.end).toBe(10)
    expect(sel.startLinePosition).toBe(0)
    expect(sel.endLinePosition).toBe(3)
  })
})

describe('Managing text functionality', () => {
  const defaultText = 'lorem ipsum'
  beforeEach(() => {
    textEditor.setTextCursorPos(0, 0)
    textEditor.clearSelections()
    textEditor.deleteTextLines(10)
    textEditor.createNewTextLines(10)
    textEditor.addText(defaultText)
  })

  test('add text "lorem ipsum"', () => {
    textEditor.addText(defaultText)
    expect(textRepresentation.getTextInLine(0)).toBe(`${defaultText}${defaultText}`)
  })

  test(`remove last character from ${defaultText}`, () => {
    textEditor.horMoveTextCursor(defaultText.length)
    textEditor.removeTextOnTextCursor(-2)
    expect(textRepresentation.getTextInLine(0)).toBe(defaultText.slice(0, defaultText.length - 2))
  })

  test(`remove text from 1 to 3 position from ${defaultText}`, () => {
    textEditor.addSelection({ start: 1, end: 3, startLinePosition: 0, endLinePosition: 0 })
    textEditor.removeTextOnSelection()
    expect(textRepresentation.getTextInLine(0)).toBe(defaultText.slice(0, 1) + defaultText.slice(3))
  })

  // test('remove text from position: 1 line: 0 to position: 3 line: 2', () => {
  //   textEditor.verMoveTextCursor(1)
  //   textEditor.addText(defaultText)
  //   textEditor.verMoveTextCursor(1)
  //   textEditor.addText(defaultText)

  //   textEditor.addSelection({ start: 1, end: 3, startLinePosition: 0, endLinePosition: 2 })
  //   textEditor.removeTextOnSelection()

  //   expect(textRepresentation.getTextInLine(0)).toBe(defaultText.slice(0, 1))
  //   expect(textRepresentation.getTextInLine(1)).toBe('')
  //   expect(textRepresentation.getTextInLine(2)).toBe(defaultText.slice(3))
  // })

  // test('multiple selecitons', () => {
  // })
})

// describe('Managing style functionality', () => {
//   test('add text style to text "lorem ipsum" from 2 to 5 with type bold', () => {
//     textEditor.addText('lorem ipsum')
//     textEditor.setTextCursorPos(2, 5, 0)
//     textEditor.addTextStyle('bold')

//     const styles = textRepresentation.getLine(0).getStyles()
//     expect(styles[0].getStartPos()).toBe(2)
//     expect(styles[0].getEndPos()).toBe(5)
//     expect(styles[0].getType()).toBe('bold')
//   })
// })
