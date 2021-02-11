import { ITextStyle } from './ITextStyle'
import { TextCursorType } from './TextCursorType'

export interface ITextCursorSubscriber {
  updateTextCursorStatus: (
    start: number,
    end: number,
    linePosition: number,
    type: TextCursorType,
    textStyles: ITextStyle[]
  ) => void
}
