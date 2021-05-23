/* global describe, test, expect, beforeEach, afterEach, afterAll */

import { TextRepresentation } from '../TextRepresentation/TextRepresentation'

const textRepresentation = new TextRepresentation()

describe('setting line position offset', () => {
  afterEach(() => {
    textRepresentation._linePositionOffset = new Map()
  })

  test('add new line to the empty position offset map', () => {
    textRepresentation._setLinePositionOffset(0, 10)
    expect(textRepresentation._linePositionOffset.get(0)).toBe(10)
  })

  test('add 3 new line to the empty position offset map', () => {
    textRepresentation._setLinePositionOffset(0, 10)
    textRepresentation._setLinePositionOffset(3, -10)
    textRepresentation._setLinePositionOffset(2, 0)

    expect(textRepresentation._linePositionOffset.get(0)).toBe(10)
    expect(textRepresentation._linePositionOffset.get(2)).toBe(0)
    expect(textRepresentation._linePositionOffset.get(3)).toBe(-10)
  })

  test('add new line to the existing line', () => {
    textRepresentation._setLinePositionOffset(0, 10)
    textRepresentation._setLinePositionOffset(0, -100)

    expect(textRepresentation._linePositionOffset.get(0)).toBe(-90)
  })
})

describe('getting line position offset', () => {
  beforeEach(() => {
    textRepresentation._linePositionOffset.set(3, -10)
    textRepresentation._linePositionOffset.set(1, 2)
    textRepresentation._linePositionOffset.set(2, 22)
    textRepresentation._linePositionOffset.set(0, 10)
  })
  afterAll(() => {
    textRepresentation._linePositionOffset = new Map()
  })

  test('get line position offset from first line', () => {
    expect(textRepresentation._getLinePositionOffset(0)).toBe(10)
  })

  test('get line position offset from last line', () => {
    expect(textRepresentation._getLinePositionOffset(3)).toBe(24)
  })

  test('get line position offset from middle line', () => {
    expect(textRepresentation._getLinePositionOffset(2)).toBe(34)
  })
})

describe('setting line text offset', () => {
  afterEach(() => {
    textRepresentation._lineTextOffset = new Map()
  })

  test('set text offset', () => {
    textRepresentation._setLineTextOffset(0, 0, 10)

    expect(textRepresentation._lineTextOffset.get(0)).toMatchObject([{ offsetPosition: 0, offset: 10 }])
  })

  test('set new text offset to the existing line', () => {
    textRepresentation._setLineTextOffset(0, 0, 10)
    textRepresentation._setLineTextOffset(0, 10, -10)
    textRepresentation._setLineTextOffset(0, 0, 1)

    expect(textRepresentation._lineTextOffset.get(0)).toMatchObject([
      { offsetPosition: 0, offset: 10 },
      { offsetPosition: 10, offset: -10 },
      { offsetPosition: 0, offset: 1 }
    ])
  })

  test('add text offset on different lines', () => {
    textRepresentation._setLineTextOffset(0, 0, 10)
    textRepresentation._setLineTextOffset(2, 13, -10)
    textRepresentation._setLineTextOffset(10, -2, 1)

    expect(textRepresentation._lineTextOffset.get(0)).toMatchObject([{ offsetPosition: 0, offset: 10 }])
    expect(textRepresentation._lineTextOffset.get(2)).toMatchObject([{ offsetPosition: 13, offset: -10 }])
    expect(textRepresentation._lineTextOffset.get(10)).toMatchObject([{ offsetPosition: -2, offset: 1 }])
  })
})

describe('getting line text offset', () => {
  beforeEach(() => {
    textRepresentation._lineTextOffset.set(0, [
      { offsetPosition: 0, offset: 10 },
      { offsetPosition: 10, offset: 1 },
      { offsetPosition: 23, offset: -4 }
    ])
    textRepresentation._lineTextOffset.set(1, [
      { offsetPosition: 2, offset: -2 },
      { offsetPosition: 0, offset: 1 },
      { offsetPosition: 4, offset: 10 }
    ])
    textRepresentation._lineTextOffset.set(2, [{ offsetPosition: 2, offset: -2 }])
  })

  afterAll(() => {
    textRepresentation._lineTextOffset = new Map()
  })

  test('get text offset from undefined line', () => {
    expect(textRepresentation._getLineTextOffset(-10, 0)).toBe(0)
  })

  test('get text offset from line', () => {
    expect(textRepresentation._getLineTextOffset(2, 2)).toBe(-2)
  })

  test('get text offset from last text offset in line', () => {
    expect(textRepresentation._getLineTextOffset(0, 24)).toBe(7)
    expect(textRepresentation._getLineTextOffset(1, 4)).toBe(9)
  })
})

describe('creating lines', () => {
  afterEach(() => {
    textRepresentation._textLines = []
  })

  test('', () => {

  })
})
