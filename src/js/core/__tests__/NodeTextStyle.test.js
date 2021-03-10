/* global test, expect, beforeEach */
import { NodeStyleContainer } from '../NodeStyleContainer'
import { NodeText } from '../NodeText'
import { NodeTextStyle } from '../NodeTextStyle'

let nodeTextStyle = new NodeTextStyle('', 'bold')

beforeEach(() => {
  nodeTextStyle = new NodeTextStyle('lorem', 'bold')
})

test('add text style from start to end', () => {
  const result = nodeTextStyle.addTextStyle('underline', 0, 0)

  expect(result).toMatchObject([
    {
      _childNodes: [{ _text: 'lorem', _textStyleType: 'bold' }],
      _textStyleType: 'underline'
    }
  ])
  expect(result[0]).toBeInstanceOf(NodeStyleContainer)
  expect(result[0]._childNodes[0]).toBeInstanceOf(NodeTextStyle)
})

test('add text style from start to middle', () => {
  const result = nodeTextStyle.addTextStyle('underline', 0, 0, 3)

  expect(result).toMatchObject([
    {
      _childNodes: [{ _text: 'lor', _textStyleType: 'bold' }],
      _textStyleType: 'underline'
    },
    { _textStyleType: 'bold', _text: 'em' }
  ])
  expect(result[0]).toBeInstanceOf(NodeStyleContainer)
  expect(result[0]._childNodes[0]).toBeInstanceOf(NodeTextStyle)
  expect(result[1]).toBeInstanceOf(NodeTextStyle)
})

test('add text style from middle to end', () => {
  const result = nodeTextStyle.addTextStyle('underline', 0, 3)

  expect(result).toMatchObject([
    { _textStyleType: 'bold', _text: 'lor' },
    {
      _childNodes: [{ _text: 'em', _textStyleType: 'bold' }],
      _textStyleType: 'underline'
    }
  ])
  expect(result[0]).toBeInstanceOf(NodeTextStyle)
  expect(result[1]._childNodes[0]).toBeInstanceOf(NodeTextStyle)
  expect(result[1]).toBeInstanceOf(NodeStyleContainer)
})

test('add text style in middle', () => {
  const result = nodeTextStyle.addTextStyle('underline', 0, 1, 3)

  expect(result).toMatchObject([
    { _textStyleType: 'bold', _text: 'l' },
    {
      _childNodes: [{ _text: 'or', _textStyleType: 'bold' }],
      _textStyleType: 'underline'
    },
    { _textStyleType: 'bold', _text: 'em' }
  ])
  expect(result[0]).toBeInstanceOf(NodeTextStyle)
  expect(result[1]._childNodes[0]).toBeInstanceOf(NodeTextStyle)
  expect(result[1]).toBeInstanceOf(NodeStyleContainer)
  expect(result[2]).toBeInstanceOf(NodeTextStyle)
})

test('remove style from start to end', () => {
  const result = nodeTextStyle.removeAllTextStyles(0, 0)

  expect(result).toMatchObject([
    { _text: 'lorem' }
  ])
  expect(result[0]).toBeInstanceOf(NodeText)
})

test('remove style from start to middle', () => {
  const result = nodeTextStyle.removeAllTextStyles(0, 0, 2)

  expect(result).toMatchObject([
    { _text: 'lo' },
    { _text: 'rem', _textStyleType: 'bold' }
  ])
  expect(result[0]).toBeInstanceOf(NodeText)
  expect(result[1]).toBeInstanceOf(NodeTextStyle)
})

test('remove style from middle to end', () => {
  const result = nodeTextStyle.removeAllTextStyles(0, 2)

  expect(result).toMatchObject([
    { _text: 'lo', _textStyleType: 'bold' },
    { _text: 'rem' }
  ])
  expect(result[0]).toBeInstanceOf(NodeTextStyle)
  expect(result[1]).toBeInstanceOf(NodeText)
})

test('remove style in middle', () => {
  const result = nodeTextStyle.removeAllTextStyles(0, 1, 3)

  expect(result).toMatchObject([
    { _text: 'l', _textStyleType: 'bold' },
    { _text: 'or' },
    { _text: 'em', _textStyleType: 'bold' }
  ])
  expect(result[0]).toBeInstanceOf(NodeTextStyle)
  expect(result[1]).toBeInstanceOf(NodeText)
  expect(result[2]).toBeInstanceOf(NodeTextStyle)
})
