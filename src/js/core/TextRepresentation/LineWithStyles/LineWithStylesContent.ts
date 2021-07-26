import { ILineContent } from '../ILineContent'
import { LineStyle } from './LineStyle'

export interface ILineWithStylesContent {
  text: string
  styles: LineStyle[]
}

export class LineWithStylesContent implements ILineContent<ILineWithStylesContent> {
  private readonly _text: string
  private readonly _styles: LineStyle[]

  constructor (text: string, styles: LineStyle[]) {
    this._text = text
    this._styles = styles
  }

  getContent (): ILineWithStylesContent {
    return {
      text: this._text,
      styles: this._styles
    }
  }

  getSize (): number {
    return this._text.length
  }
}
