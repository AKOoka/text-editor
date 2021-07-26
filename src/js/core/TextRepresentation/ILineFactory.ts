import { ITextEditorRepresentationLine } from './ITextEditorRepresentationLine'
import { Range } from '../../common/Range'

export interface ILineFactory<LineRange extends Range, LinePosition> {
  createLine: () => ITextEditorRepresentationLine
  createLineRange: (start: number, end: number) => LineRange
  createLinePosition: (position: number) => LinePosition
}
