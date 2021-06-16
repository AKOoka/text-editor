import { Selection } from './Selection'

export interface ITextCursorSelectionsSubscriber {
  updateTextCursorSelections: (selections: Selection[]) => void
}
