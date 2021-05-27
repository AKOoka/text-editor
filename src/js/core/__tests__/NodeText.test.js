/* global test, expect, beforeEach */
import { NodeText } from '../TextRepresentation/Nodes/NodeText'
import { NodeTextStyle } from '../TextRepresentation/Nodes/NodeTextStyle'

let nodeText = new NodeText('')

beforeEach(() => {
  nodeText = new NodeText('lorem')
})

test('add text', () => {
  nodeText.addText('lorem ', 0, 0)

  expect(nodeText._text).toBe('lorem lorem')
})

test('add text in middle', () => {
  nodeText.addText(' ipsum ', 0, 2)

  expect(nodeText._text).toBe('lo ipsum rem')
})

test('delete text from middle', () => {
  nodeText.deleteText(0, 2, 4)

  expect(nodeText._text).toBe('lom')
})

test('delete text from middle to end', () => {
  nodeText.deleteText(0, 2, 'lorem'.length)

  expect(nodeText._text).toBe('lo')
})

test('delete all text', () => {
  nodeText.deleteText(0, 0)

  expect(nodeText.deleteText(0, 0, 'lorem'.length)).toBeTruthy()
  expect(nodeText._text).toBe('')
})

test('add style from start to end of text', () => {
  const result = nodeText.addTextStyle(0, 0, 'lorem'.length, 'bold')

  expect(result).toMatchObject([{ _text: 'lorem', _textStyle: 'bold' }])
  expect(result[0]).toBeInstanceOf(NodeTextStyle)
})

test('add style from start to middle', () => {
  const result = nodeText.addTextStyle(0, 0, 2, 'bold')

  expect(result).toMatchObject([
    { _text: 'lo', _textStyle: 'bold' },
    { _text: 'rem' }
  ])
  expect(result[0]).toBeInstanceOf(NodeTextStyle)
  expect(result[1]).toBeInstanceOf(NodeText)
})

test('add style from middle to end', () => {
  const result = nodeText.addTextStyle(0, 2, 'lorem'.length, 'bold')

  expect(result).toMatchObject([
    { _text: 'lo' },
    { _text: 'rem', _textStyle: 'bold' }
  ])
  expect(result[0]).toBeInstanceOf(NodeText)
  expect(result[1]).toBeInstanceOf(NodeTextStyle)
})

test('add style in middle', () => {
  const result = nodeText.addTextStyle(0, 2, 4, 'bold')

  expect(result).toMatchObject([
    { _text: 'lo' },
    { _text: 're', _textStyle: 'bold' },
    { _text: 'm' }
  ])
  expect(result[0]).toBeInstanceOf(NodeText)
  expect(result[1]).toBeInstanceOf(NodeTextStyle)
  expect(result[2]).toBeInstanceOf(NodeText)
})
