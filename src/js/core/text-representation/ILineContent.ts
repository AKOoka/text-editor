import { TextStyle } from '../../common/TextStyle'
import { Range } from '../../common/Range'
import { Node } from './line-with-nodes/INode'

export interface StyleWithRange {
  textStyle: TextStyle
  range: Range
}

export interface ILineContent {
  getContent: () => Node[]
  getStyles: () => StyleWithRange[]
  getStylesConcrete: (textStyles: TextStyle[]) => StyleWithRange[]
  getText: () => string
  getSize: () => number
}
