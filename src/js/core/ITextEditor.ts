import { IRange } from '../common/IRange'

export interface ITextEditor {
  addText: (text: string) => void
  removeTextOnTextCursor: (offset: number) => void
  removeTextOnSelection: () => void
  addTextStyle: (textStyleType: string) => void
  addSelection: (selection: IRange) => void
  clearSelections: () => void
  removeTextStyle: (textStyleType: string) => void
  setTextCursorPos: (position: number, linePosition: number) => void
  horMoveTextCursor: (offset: number) => void
  verMoveTextCursor: (offset: number) => void
  createNewTextLines: (count?: number) => void
  removeTextLines: (count?: number) => void
  updateTextRepresentation: () => void
  updateTextCursor: () => void
}
