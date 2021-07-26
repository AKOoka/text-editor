import { ILineFactory } from './ILineFactory'
import { ITextEditorRepresentationLine } from './ITextEditorRepresentationLine'
import { LineWithStyles } from './LineWithStyles/LineWithStyles'
import { Range } from '../../common/Range'

export class LineWithStylesFactory implements ILineFactory<Range, number> {
  createLine (): ITextEditorRepresentationLine {
    return new LineWithStyles()
  }

  createLineRange (start: number, end: number): Range {
    return new Range(start, end)
  }

  createLinePosition (position: number): number {
    return position
  }
}
