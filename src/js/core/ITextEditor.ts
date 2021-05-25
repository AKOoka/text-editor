import { IRange } from '../common/IRange'
import { TextStyleType } from '../common/TextStyleType'
import { ITextCursorPositionSubscriber } from '../common/ITextCursorPositionSubscriber'
import { ITextCursorSelectionsSubscriber } from '../common/ITextCursorSelectionsSubscriber'
import { ITextRepresentationSubscriber } from '../common/ITextRepresentationSubscriber'
import { IActiveTextStylesSubscriber } from '../common/IActiveTextStylesSubscriber'
import { RequestType } from '../common/RequestType'
import { TextEditorResponse } from '../common/TextEditorResponse'

export interface ITextEditor {
  init: () => void
  addText: (text: string) => void
  deleteTextOnTextCursor: (offset: number) => void
  deleteTextOnSelection: () => void
  addTextStyle: (textStyleType: string) => void
  addSelections: (selections: IRange[]) => void
  clearSelections: () => void
  removeConcreteTextStyle: (textStyleType: TextStyleType) => void
  removeAllTextStyles: () => void
  setTextCursorXPosition: (x: number) => void
  setTextCursorYPosition: (y: number) => void
  moveTextCursorXPosition: (offset: number) => void
  moveTextCursorYPosition: (offset: number) => void
  createNewTextLines: (count?: number) => void
  deleteTextLines: (count?: number) => void
  subscribeForTextCursorPosition: (subscriber: ITextCursorPositionSubscriber) => void
  subscribeForTextCursorSelections: (subscriber: ITextCursorSelectionsSubscriber) => void
  subscribeForTextRepresentation: (subscriber: ITextRepresentationSubscriber) => void
  subscribeForActiveStyles: (subscriber: IActiveTextStylesSubscriber) => void
  updateTextCursorPosition: () => void
  updateTextCursorSelections: () => void
  updateTextRepresentation: () => void
  updateActiveStyles: () => void
  fetchData: (request: RequestType) => TextEditorResponse
}
