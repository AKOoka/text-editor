/* global test, expect, beforeEach */
import { NodeStyleContainer } from '../NodeStyleContainer'
import { NodeText } from '../NodeText'
import { NodeTextStyle } from '../NodeTextStyle'

const defaultStyle = 'underline'
const defaultText = 'lorem'

let nodeStyleContainer = new NodeStyleContainer(defaultStyle, [])

function childNodesMatchTo (matchObject) {
  expect(nodeStyleContainer._childNodes).toMatchObject(matchObject)
}
function instanceOfChildNodes (types) {
  for (let i = 0; i < types.length; i++) {
    expect(nodeStyleContainer._childNodes[i]).toBeInstanceOf(types[i])
  }
}

beforeEach(() => {
  // be better if i eliminate dependency of NodeText instance
  nodeStyleContainer = new NodeStyleContainer(defaultStyle, [new NodeText(defaultText)])
})

test('add text to middle', () => {
  nodeStyleContainer.addText(defaultText, 0, 2)

  childNodesMatchTo([{ _text: defaultText.slice(0, 2) + defaultText + defaultText.slice(2) }])
  instanceOfChildNodes([NodeText])
})

test('add text to start', () => {
  nodeStyleContainer.addText('ipsum', 0, 0)

  childNodesMatchTo([{ _text: 'ipsum' + defaultText }])
  instanceOfChildNodes([NodeText])
})

test('add text to end', () => {
  nodeStyleContainer.addText('ipsum', 0, nodeStyleContainer.getSize())

  childNodesMatchTo([{ _text: defaultText + 'ipsum' }])
  instanceOfChildNodes([NodeText])
})

test('add text to second child node', () => {
  nodeStyleContainer._childNodes.push(new NodeText('ipsum'))
  nodeStyleContainer.addText(' foo ', 0, defaultText.length + 2)

  childNodesMatchTo([{ _text: defaultText }, { _text: 'ip foo sun' }])
  instanceOfChildNodes([NodeText, NodeText])
})

test('delete text', () => {
  const result = nodeStyleContainer.removeText(0, 1, 3)

  childNodesMatchTo([{ _text: defaultText.slice(0, 1) + defaultText.slice(3) }])
  expect(result).toBeFalsy()
})

test('delete all text', () => {
  const result = nodeStyleContainer.removeText(0, 0)

  childNodesMatchTo([])
  expect(result).toBeTruthy()
})

test('delete middle node', () => {
  nodeStyleContainer._childNodes.push(new NodeText('ipsum'), new NodeText('foo'))
  const result = nodeStyleContainer.removeText(0, defaultText.length, defaultText.length + 'ipsum'.length)

  childNodesMatchTo([{ _text: defaultText }, { _text: 'foo' }])
  instanceOfChildNodes([NodeText, NodeText])
  expect(result).toBeFalsy()
})

test('add text style to two nodes', () => {
  nodeStyleContainer._childNodes.push(new NodeText('ipsum'), new NodeText('foo'))
  nodeStyleContainer.addTextStyle('italic', 0, 2, 2 + defaultText.length)

  childNodesMatchTo([
    { _text: 'lo' },
    { _text: 'rem', _textStyleType: 'bold' },
    { _text: 'ip', _textStyleType: 'bold' },
    { _text: 'sun' },
    { _text: 'foo' }
  ])
  instanceOfChildNodes([NodeText, NodeTextStyle, NodeTextStyle, NodeText, NodeText])
})
