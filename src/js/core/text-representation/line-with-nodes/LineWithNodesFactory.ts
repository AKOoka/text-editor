import { ILineFactory } from '../ILineFactory'
import { ITextEditorRepresentationLine } from '../ITextEditorRepresentationLine'
import { LineWithNodes } from './LineWithNodes'
import { PositionWithOffset } from './util/PositionWithOffset'
import { RangeWithOffset } from './util/RangeWithOffset'

export class LineWithNodesFactory implements ILineFactory {
  createLine (): ITextEditorRepresentationLine {
    return new LineWithNodes()
  }

  createLineRange (start: number, end: number): RangeWithOffset {
    return new RangeWithOffset(start, end, 0)
  }

  createLinePosition (position: number): PositionWithOffset {
    return new PositionWithOffset(position, 0)
  }
}
