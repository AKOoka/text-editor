import { IRange } from '../common/IRange'
import { ITextCursorSubscriber } from '../common/ITextCursorSubscriber'

export interface ITextCursor {
  getPosition: () => number
  getLinePosition: () => number
  getSelections: () => IRange[]
  addSelection: (selection: IRange) => void
  clearSelections: () => void
  setPos: (position: number, linePosition: number) => void
  subscribe: (subscriber: ITextCursorSubscriber) => void
  updateSubscribers: () => void
}
