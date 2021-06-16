import { ITextCursorPositionSubscriber } from '../common/ITextCursorPositionSubscriber'
import { ITextCursorSelectionsSubscriber } from '../common/ITextCursorSelectionsSubscriber'
import { ITextRepresentationSubscriber } from '../common/ITextRepresentationSubscriber'
import { IActiveTextStylesSubscriber } from '../common/IActiveTextStylesSubscriber'
import { Selection } from '../common/Selection'
import { IPoint } from '../common/IPoint'
import { Range } from '../common/Range'
import { INodeCopy } from './TextRepresentation/Nodes/INode'
import { TextStyle } from '../common/TextStyle'

export interface ITextEditor {
  init: () => void
  getContext: () => HTMLElement
  addText: (point: IPoint, text: string) => void
  addContent: (point: IPoint, content: INodeCopy[]) => void
  addTextStyleInSelections: (selections: Selection[], textStyleType: TextStyle) => void
  addTextCursorSelections: (selections: Selection[]) => void
  addNewLinesInRange: (rangeY: Range) => void
  changeTextCursorSelection: (selectionIndex: number, selection: Selection) => void
  deleteTextInRange: (y: number, rangeX: Range) => void
  deleteTextInSelections: (selections: Selection[]) => void
  deleteConcreteTextStylesInSelections: (selections: Selection[], textStyleType: TextStyle) => void
  deleteAllTextStylesInSelections: (selections: Selection[]) => void
  deleteLinesInRange: (rangeY: Range) => void
  deleteConcreteTextCursorSelection: (selectionIndex: number) => void
  deleteAllTextCursorSelections: () => void
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
  getTextCursorSelections: () => Selection[]
  getLineLength: (lineY: number) => number
  getLinesCount: () => number
  getContentInSelections: (selections: Selection[]) => INodeCopy[]
}
