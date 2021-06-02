import { TextStyleType } from '../common/TextStyleType'
import { ITextCursorPositionSubscriber } from '../common/ITextCursorPositionSubscriber'
import { ITextCursorSelectionsSubscriber } from '../common/ITextCursorSelectionsSubscriber'
import { ITextRepresentationSubscriber } from '../common/ITextRepresentationSubscriber'
import { IActiveTextStylesSubscriber } from '../common/IActiveTextStylesSubscriber'
import { NodeRepresentation } from './TextRepresentation/NodeRepresentation'
import { ISelection } from '../common/ISelection'
import { IPoint } from '../common/IPoint'
import { Range } from '../common/Range'

export interface ITextEditor {
  init: () => void
  getContext: () => HTMLElement
  addText: (point: IPoint, text: string) => void
  addContent: (point: IPoint, content: NodeRepresentation[]) => void
  addTextStyleInSelections: (selections: ISelection[], textStyleType: TextStyleType) => void
  addTextCursorSelections: (selections: ISelection[]) => void
  addNewLinesInRange: (rangeY: Range) => void
  deleteTextInRange: (y: number, rangeX: Range) => void
  deleteTextInSelections: (selections: ISelection[]) => void
  deleteConcreteTextStylesInSelections: (selections: ISelection[], textStyleType: TextStyleType) => void
  deleteAllTextStylesInSelections: (selections: ISelection[]) => void
  deleteLinesInRange: (rangeY: Range) => void
  deleteTextCursorSelections: () => void
  setTextCursorX: (x: number) => void
  setTextCursorY: (y: number) => void
  setTextCursorPosition: (position: IPoint) => void
  subscribeForTextCursorPosition: (subscriber: ITextCursorPositionSubscriber) => void
  subscribeForTextCursorSelections: (subscriber: ITextCursorSelectionsSubscriber) => void
  subscribeForTextRepresentation: (subscriber: ITextRepresentationSubscriber) => void
  subscribeForActiveStyles: (subscriber: IActiveTextStylesSubscriber) => void
  updateTextCursorPosition: () => void
  updateTextCursorSelections: () => void
  updateTextRepresentation: () => void
  updateActiveStyles: () => void
  getTextCursorX: () => number
  getTextCursorY: () => number
  getTextCursorPosition: () => IPoint
  getLineLength: (lineY: number) => number
  getLinesCount: () => number
  getTextCursorSelections: () => ISelection[]
  getContentInSelections: (selections: ISelection[]) => NodeRepresentation[]
}
