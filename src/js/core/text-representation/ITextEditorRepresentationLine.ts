import { Range } from '../../common/Range'
import { TextStyle } from '../../common/TextStyle'
import { ILineContent } from './ILineContent'

export interface ITextEditorRepresentationLine {
  getSize: () => number
  getContent: () => ILineContent
  getContentInRange: (range: Range) => ILineContent
  getTextStylesInRange: (range: Range) => TextStyle[]
  // getUpdates: () => INodeUpdate[]
  addText: (position: unknown, text: string) => void
  addContent: (position: unknown, content: ILineContent) => void
  addTextStyle: (range: Range, textStyle: TextStyle) => void
  deleteText: (range: Range) => void
  deleteTextStyleAll: (range: Range) => void
  deleteTextStyleConcrete: (range: Range, textStyle: TextStyle) => void
}
