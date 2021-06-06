/* global test, expect, beforeEach */

import { NodeContainerLine } from '../TextRepresentation/Nodes/NodeContainerLine'
import { NodeText } from '../TextRepresentation/Nodes/NodeText'
import { NodeTextStyle } from '../TextRepresentation/Nodes/NodeTextStyle'

let nodeContainer = new NodeContainerLine([])
const defaultText = 'lorem'

function childNodesMatchTo (matchObject) {
  expect(nodeContainer._childNodes).toMatchObject(matchObject)
}
function instanceOfChildNodes (types) {
  for (let i = 0; i < types.length; i++) {
    expect(nodeContainer._childNodes[i]).toBeInstanceOf(types[i])
  }
}

beforeEach(() => {
  nodeContainer = new NodeContainerLine([new NodeText(defaultText)])
})

test('add text to middle', () => {
  nodeContainer.addText(defaultText, 0, 2)

  childNodesMatchTo([{ _text: defaultText.slice(0, 2) + defaultText + defaultText.slice(2) }])
  instanceOfChildNodes([NodeText])
})

test('add text to start', () => {
  nodeContainer.addText('ipsum', 0, 0)

  childNodesMatchTo([{ _text: 'ipsum' + defaultText }])
  instanceOfChildNodes([NodeText])
})

test('add text to end', () => {
  nodeContainer.addText('ipsum', 0, nodeContainer.getSize())

  childNodesMatchTo([{ _text: defaultText + 'ipsum' }])
  instanceOfChildNodes([NodeText])
})

test('add text to second child node', () => {
  nodeContainer._childNodes.push(new NodeText('ipsum'))
  nodeContainer.addText(' foo ', 0, defaultText.length + 2)

  childNodesMatchTo([{ _text: defaultText }, { _text: 'ip foo sum' }])
  instanceOfChildNodes([NodeText, NodeText])
})

test('delete text', () => {
  const result = nodeContainer.deleteText(0, 1, 3)

  childNodesMatchTo([{ _text: defaultText.slice(0, 1) + defaultText.slice(3) }])
  expect(result).toBeFalsy()
})

test('delete all text', () => {
  const result = nodeContainer.deleteText(0, 0, defaultText.length)

  childNodesMatchTo([])
  expect(result).toBeTruthy()
})

test('delete middle node', () => {
  // nodeContainer._childNodes.push(new NodeText('ipsum'), new NodeText('foo'))
  nodeContainer = new NodeContainerLine([
    new NodeText(defaultText), new NodeText('ipsum'), new NodeText('foo')
  ])
  const result = nodeContainer.deleteText(0, defaultText.length, defaultText.length + 'ipsum'.length)

  childNodesMatchTo([{ _text: defaultText + 'foo' }])
  instanceOfChildNodes([NodeText])
  expect(result).toBeFalsy()
})

test('add text style to two nodes', () => {
  nodeContainer._childNodes.push(new NodeText('ipsum'), new NodeText('foo'))
  nodeContainer.addTextStyle(0, 2, 2 + defaultText.length, 'italic')

  childNodesMatchTo([
    { _text: 'lo' },
    { _text: 'remip', _textStyle: 'italic' },
    { _text: 'sumfoo' }
  ])
  instanceOfChildNodes([NodeText, NodeTextStyle, NodeText])
})
