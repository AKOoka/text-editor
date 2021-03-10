/* global test, expect, beforeEach, afterEach */
import { HistoryCommandDispatcher } from '../HistoryCommandDispatcher'

const commandDispatcher = {
  doCommand () {},
  undoCommand () {}
}
const command = {
  doCommand () {},
  undoCommand () {},
  toBeSaved () {
    return true
  }
}

let historyCommandDispatcher = new HistoryCommandDispatcher(commandDispatcher)

beforeEach(() => {
  historyCommandDispatcher = new HistoryCommandDispatcher(commandDispatcher)
})

afterEach(() => {})

test('do command', () => {
  historyCommandDispatcher.doCommand(command)

  expect(historyCommandDispatcher._historyPointerOffset).toBe(0)
  expect(historyCommandDispatcher._commandHistory).toMatchObject([command])
})

test('undo command', () => {
  historyCommandDispatcher.doCommand(command)
  historyCommandDispatcher.undoCommand()

  expect(historyCommandDispatcher._historyPointerOffset).toBe(1)
  expect(historyCommandDispatcher._commandHistory).toMatchObject([command])
})

test('undo more commands than in history', () => {
  historyCommandDispatcher.doCommand(command)
  historyCommandDispatcher.undoCommand()
  historyCommandDispatcher.undoCommand()
  historyCommandDispatcher.undoCommand()

  expect(historyCommandDispatcher._historyPointerOffset).toBe(1)
  expect(historyCommandDispatcher._commandHistory).toMatchObject([command])
})

test('redo command', () => {
  historyCommandDispatcher.doCommand(command)
  historyCommandDispatcher.undoCommand()
  historyCommandDispatcher.redoCommand()

  expect(historyCommandDispatcher._historyPointerOffset).toBe(0)
  expect(historyCommandDispatcher._commandHistory).toMatchObject([command])
})

test('redo more commands than in history', () => {
  historyCommandDispatcher.doCommand(command)
  historyCommandDispatcher.undoCommand()
  historyCommandDispatcher.redoCommand()
  historyCommandDispatcher.redoCommand()
  historyCommandDispatcher.redoCommand()

  expect(historyCommandDispatcher._historyPointerOffset).toBe(0)
  expect(historyCommandDispatcher._commandHistory).toMatchObject([command])
})
