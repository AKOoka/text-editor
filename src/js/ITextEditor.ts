import { RemoveDirection } from './RemoveDirection'

export interface ITextEditor {
  addText: (text: string) => void
  removeText: (direction?: RemoveDirection) => void
  addTextStyle: (textStyleType: string) => void
  removeTextStyle: () => void
  setCursorPos: (start: number, end: number, linePosition: number) => void
}
