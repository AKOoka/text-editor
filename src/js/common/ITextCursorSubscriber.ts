import { IRange } from './IRange'

export interface ITextCursorSubscriber {
  updateTextCursorPosition: (position: number, linePosition: number, selections: IRange[]) => void
  updateTextCursorSelections: (selections: IRange[]) => void
}
