import { IRange } from '../common/IRange'
import { ITextRepresentationSubscriber } from '../common/ITextRepresentationSubscriber'
import { HtmlTextRepresentationChanges } from './HtmlTextRepresentationChanges'

export interface ITextRepresentation {
  getLinesCount: () => number
  createNewLines: (linePosition: number, count: number) => void
  deleteLines: (linePosition: number, count: number) => void
  addTextInLine: (text: string, linePosition: number, position: number) => void
  deleteTextInLine: (linePosition: number, start: number, end: number) => void
  deleteTextInRanges: (textCursorPositions: IRange[]) => void
  getTextStylesInRanges: (textCursorPositions: IRange[]) => void
  addTextStylesInRanges: (textStyleType: string, textCursorPositions: IRange[]) => void
  removeTextStylesInRanges: (textStyleType: string, textCursorPositions: IRange[]) => void
  subscribe: (subscriber: ITextRepresentationSubscriber<HtmlTextRepresentationChanges>) => void
  updateSubscribers: () => void
}
