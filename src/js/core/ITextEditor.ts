import { ITextCursorPositionSubscriber } from '../common/ITextCursorPositionSubscriber'
import { ITextCursorSelectionsSubscriber } from '../common/ITextCursorSelectionsSubscriber'
import { ITextRepresentationSubscriber } from '../common/ITextRepresentationSubscriber'
import { IActiveTextStylesSubscriber } from '../common/IActiveTextStylesSubscriber'
import { Selection } from '../common/Selection'
import { Point } from '../common/Point'
import { Range } from '../common/Range'
import { TextStyle } from '../common/TextStyle'
import { ILineContent } from './TextRepresentation/ILineContent'

export interface ITextEditor {
  init: () => void
  getHtmlContext: () => HTMLElement
  addText: (point: Point, text: string) => void
  addContent: (point: Point, content: ILineContent[]) => void
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
  setTextCursorPoint: (point: Point) => void
  subscribeForTextCursorPoint: (subscriber: ITextCursorPositionSubscriber) => void
  subscribeForTextCursorSelections: (subscriber: ITextCursorSelectionsSubscriber) => void
  subscribeForTextRepresentation: (subscriber: ITextRepresentationSubscriber) => void
  subscribeForActiveStyles: (subscriber: IActiveTextStylesSubscriber) => void
  updateTextCursorPoint: () => void
  updateTextCursorSelections: () => void
  updateTextRepresentation: () => void
  updateActiveStyles: () => void
  getTextCursorX: () => number
  getTextCursorY: () => number
  getTextCursorPoint: () => Point
  getTextCursorSelections: () => Selection[]
  getLineSize: (y: number) => number
  getLinesCount: () => number
  getContentInSelections: (selections: Selection[]) => ILineContent[]
}
