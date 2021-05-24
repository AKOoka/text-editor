import { IRange } from './IRange'

export interface ITextCursorPositionSubscriber {
  updateTextCursorPosition: (position: number, linePosition: number, selections: IRange[]) => void
}
