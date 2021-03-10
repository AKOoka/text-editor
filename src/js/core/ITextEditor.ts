import { IRange } from '../common/IRange'

export interface ITextEditor {
  addText: (text: string) => void
  deleteTextOnTextCursor: (offset: number) => void
  deleteTextOnSelection: () => void
  addTextStyle: (textStyleType: string) => void
  addSelection: (selection: IRange) => void
  clearSelections: () => void
  deleteTextStyle: (textStyleType: string) => void
  setTextCursorPos: (position: number, linePosition: number) => void
  horMoveTextCursor: (offset: number) => void
  verMoveTextCursor: (offset: number) => void
  createNewTextLines: (count?: number) => void
  deleteTextLines: (count?: number) => void
  updateTextRepresentation: () => void
  updateTextCursor: () => void
}
