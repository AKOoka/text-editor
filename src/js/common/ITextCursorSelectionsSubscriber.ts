import { ISelection } from './ISelection'

export interface ITextCursorSelectionsSubscriber {
  updateTextCursorSelections: (selections: ISelection[]) => void
}
