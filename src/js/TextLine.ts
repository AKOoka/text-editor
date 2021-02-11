import { ITextStyle } from './ITextStyle'
import { ITextLine } from './ITextLine'

class TextLine implements ITextLine {
  private _text: string
  private readonly _styles: ITextStyle[]

  constructor () {
    this._text = ''
    this._styles = []
  }

  getText (): string {
    return this._text
  }

  setText (text: string): void {
    this._text = text
  }

  getStyles (): ITextStyle[] {
    return this._styles
  }

  addTextStyle (style: ITextStyle): void {
    this._styles.push(style)
  }

  getTextStylesInRange (start: number, end: number): ITextStyle[] {
    const output: ITextStyle[] = []

    for (const style of this._styles) {
      const [s, e] = [style.getStartPos(), style.getEndPos()]

      if (
        (start >= s && start <= e) ||
        (s >= start && e <= end) ||
        (end >= s && end <= e)
      ) {
        output.push(style)
      }
    }

    return output
  }

  removeTextStyleInRange (start: number, end: number): void {

  }
}

export { TextLine }
