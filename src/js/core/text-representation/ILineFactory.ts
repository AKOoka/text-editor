import { Range } from '../../common/Range'
import { ITextRepresentationLine } from './ITextRepresentationLine'

export interface ILineFactory {
  createLine: () => ITextRepresentationLine
  createLineRange: (start: number, end: number) => Range
  createLinePosition: (position: number) => unknown
}
