export class TextAreaLayerText {
  private readonly _context: HTMLElement
  private readonly _textLines: HTMLElement[]

  constructor () {
    this._context = document.createElement('pre')
    this._context.classList.add('text-area_layer-text')
    this._textLines = []
  }

  get context (): HTMLElement {
    return this._context
  }

  addTextLine (y: number, line: HTMLElement): void {
    this._context.insertBefore(line, this._textLines[y])
    this._textLines.splice(y, 0, line)
  }

  changeTextLine (y: number, line: HTMLElement): void {
    this._textLines[y].replaceWith(line)
    this._textLines[y] = line
  }

  deleteTextLine (y: number): void {
    this._textLines[y].remove()
    this._textLines.splice(y, 1)
  }

  getTextLine (y: number): HTMLElement {
    return this._textLines[y]
  }

  getAllTextLines (): HTMLElement[] {
    return this._textLines
  }

  getTextLengthInLine (y: number): number {
    return this._textLines[y].innerText.length
  }

  getTextLengthInAllLines (): number[] {
    const textLength: number[] = []
    for (let i = 0; i < this._textLines.length; i++) {
      textLength.push(this.getTextLengthInLine(i))
    }
    return textLength
  }
}
