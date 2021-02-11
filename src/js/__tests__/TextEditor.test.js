/* global describe, test, expect */
const { sum } = require('./t')

describe('Add text function', () => {
  test('it should add text in concrete position', () => {
    expect(sum(1, 3)).toBe(4)
  })
})
