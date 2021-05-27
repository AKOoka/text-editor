/* global test, expect, beforeEach */
import { NodeStyleContainer } from '../TextRepresentation/Nodes/NodeStyleContainer'
import { NodeText } from '../TextRepresentation/Nodes/NodeText'
import { NodeTextStyle } from '../TextRepresentation/Nodes/NodeTextStyle'
import { NodeLineContainer } from '../TextRepresentation/Nodes/NodeLineContainer'

const defaultStyle = 'underline'
const defaultText = 'lorem'

let nodeStyleContainer = new NodeStyleContainer([], defaultStyle)

function childNodesMatchTo (matchObject) {
  expect(nodeStyleContainer._childNodes).toMatchObject(matchObject)
}
function instanceOfChildNodes (types) {
  for (let i = 0; i < types.length; i++) {
    expect(nodeStyleContainer._childNodes[i]).toBeInstanceOf(types[i])
  }
}

beforeEach(() => {
  nodeStyleContainer = new NodeStyleContainer([new NodeText(defaultText)], defaultStyle)
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

  childNodesMatchTo([{ _text: defaultText }, { _text: 'ip foo sum' }])
  instanceOfChildNodes([NodeText, NodeText])
})

test('delete text', () => {
  const result = nodeStyleContainer.deleteText(0, 1, 3)

  childNodesMatchTo([{ _text: defaultText.slice(0, 1) + defaultText.slice(3) }])
  expect(result).toBeFalsy()
})

test('delete all text', () => {
  const result = nodeStyleContainer.deleteText(0, 0, defaultText.length)

  childNodesMatchTo([])
  expect(result).toBeTruthy()
})

test('delete middle node', () => {
  // nodeStyleContainer._childNodes.push(new NodeText('ipsum'), new NodeText('foo'))
  nodeStyleContainer = new NodeLineContainer([
    new NodeText(defaultText), new NodeText('ipsum'), new NodeText('foo')
  ])
  const result = nodeStyleContainer.deleteText(0, defaultText.length, defaultText.length + 'ipsum'.length)

  childNodesMatchTo([{ _text: defaultText + 'foo' }])
  instanceOfChildNodes([NodeText])
  expect(result).toBeFalsy()
})

test('add text style to two nodes', () => {
  nodeStyleContainer._childNodes.push(new NodeText('ipsum'), new NodeText('foo'))
  nodeStyleContainer.addTextStyle(0, 2, 2 + defaultText.length, 'italic')

  childNodesMatchTo([
    { _text: 'lo' },
    { _text: 'remip', _textStyle: 'italic' },
    { _text: 'sumfoo' }
  ])
  instanceOfChildNodes([NodeText, NodeTextStyle, NodeText])
})
