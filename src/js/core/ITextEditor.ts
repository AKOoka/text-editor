import { IRange } from '../common/IRange'
import { TextStyleType } from '../common/TextStyleType'

export interface ITextEditor {
  addText: (text: string) => void
  deleteTextOnTextCursor: (offset: number) => boolean
  deleteTextOnSelection: () => void
  addTextStyle: (textStyleType: string) => void
  addSelections: (selections: IRange[]) => void
  clearSelections: () => IRange[]
  removeConcreteTextStyle: (textStyleType: TextStyleType) => void
  removeAllTextStyles: () => void
  setVerticalPositionTextCursor: (position: number) => void
  setHorizontalPositionTextCursor: (position: number) => void
  horizontalMoveTextCursor: (offset: number) => void
  verticalMoveTextCursor: (offset: number) => void
  createNewTextLines: (count?: number) => void
  deleteTextLines: (count?: number) => void
  updateTextRepresentation: () => void
  updateTextCursor: () => void
}
