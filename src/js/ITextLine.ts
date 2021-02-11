import { ITextStyle } from './ITextStyle'

export interface ITextLine {
  getText: () => string
  setText: (text: string) => void
  getStyles: () => ITextStyle[]
  addTextStyle: (style: ITextStyle) => void
  getTextStylesInRange: (start: number, end: number) => ITextStyle[]
  removeTextStyleInRange: (start: number, end: number) => void
}
