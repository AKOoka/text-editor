import { Point } from './Point'

export interface ITextCursorPositionSubscriber {
  updateTextCursorPosition: (position: Point) => void
}
