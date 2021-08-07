import { Range } from '../../common/Range'
import { ITextEditorRepresentationLine } from './ITextEditorRepresentationLine'

export interface ILineFactory {
  createLine: () => ITextEditorRepresentationLine
  createLineRange: (start: number, end: number) => Range
  createLinePosition: (position: number) => unknown
}
