import { IRange } from './IRange'

export interface ITextCursorSelectionsSubscriber {
  updateTextCursorSelections: (selections: IRange[]) => void
}
