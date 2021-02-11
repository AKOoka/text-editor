import { TextLine } from './TextLine'
import { ITextRepresentation } from './ITextRepresentation'

class TextRepresentation implements ITextRepresentation {
  private readonly _text: Map<number, TextLine>

  constructor () {
    this._text = new Map()
  }

  getLine (linePosition: number): TextLine {
    const line = this._text.get(linePosition)

    if (line === undefined) {
      throw new Error(`there is no line on ${linePosition} line position`)
    }

    return line
  }

  setLine (linePosition: number, line: TextLine): void {
    this._text.set(linePosition, line)
  }
}

export { TextRepresentation }
