import { IPoint } from './IPoint'

export interface ITextCursorPositionSubscriber {
  updateTextCursorPosition: (position: IPoint) => void
}
