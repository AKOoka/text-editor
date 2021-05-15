import { IRange } from '../common/IRange'
import { ITextRepresentationSubscriber } from '../common/ITextRepresentationSubscriber'
import { HtmlTextRepresentationChanges } from './HtmlTextRepresentationChanges'
import { TextStyleType } from '../common/TextStyleType'

export interface ITextRepresentation {
  getLinesCount: () => number
  getTextLengthInLine: (linePosition: number) => number
  createNewLines: (linePosition: number, count: number) => void
  deleteLines: (linePosition: number, count: number) => void
  addTextInLine: (text: string, linePosition: number, position: number) => void
  deleteTextInLine: (linePosition: number, start: number, end: number) => boolean
  deleteTextInRanges: (textCursorPositions: IRange[]) => void
  getTextStylesInRanges: (textCursorPositions: IRange[]) => void
  addTextStylesInRanges: (textStyleType: TextStyleType, textCursorPositions: IRange[]) => void
  removeConcreteTextStyleInRanges: (textStyleType: TextStyleType, textCursorPositions: IRange[]) => void
  removeAllTextStylesInRanges: (textCursorPosition: IRange[]) => void
  subscribe: (subscriber: ITextRepresentationSubscriber<HtmlTextRepresentationChanges>) => void
  updateSubscribers: () => void
}
