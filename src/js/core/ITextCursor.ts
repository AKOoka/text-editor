import { IRange } from '../common/IRange'
import { ITextCursorSubscriber } from '../common/ITextCursorSubscriber'

export interface ITextCursor {
  getHorizontalPosition: () => number
  setHorizontalPosition: (position: number) => void
  getVerticalPosition: () => number
  setVerticalPosition: (linePosition: number) => void
  getSelections: () => IRange[]
  addSelection: (selection: IRange) => void
  clearSelections: () => void
  subscribe: (subscriber: ITextCursorSubscriber) => void
  updateSubscribers: () => void
}
