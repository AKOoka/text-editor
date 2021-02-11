import { ITextStyle } from './ITextStyle';
import { TextCursorType } from './TextCursorType'

export interface ITextCursor {
  getType: () => TextCursorType
  getStart: () => number
  getEnd: () => number
  getLinePosition: () => number
  getTextStyles: () => ITextStyle[]
  setPos: (start: number, end: number, linePosition: number, textStyles: ITextStyle[]) => void
}
