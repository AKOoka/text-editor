import { TextStyle } from '../../common/TextStyle'
import { Range } from '../../common/Range'
import { ILineContent } from './ILineContent'
import { ILineWithStylesContent } from './LineWithStyles/LineWithStylesContent'

export interface ITextEditorRepresentationLine<Content = ILineWithStylesContent> {
  getSize: () => number
  getContent: () => ILineContent<Content>
  getContentInRange: (range: Range) => ILineContent<Content>
  getTextStylesInRange: (range: Range) => TextStyle[]
  // getRepresentation: () => NodeRepresentation
  // getUpdates: () => INodeUpdate[]
  addText: (position: number, text: string) => void
  addContent: (position: number, content: ILineContent<Content>) => void
  addTextStyle: (range: Range, textStyle: TextStyle) => void
  deleteText: (range: Range) => void
  deleteTextStyleAll: (range: Range) => void
  deleteTextStyleConcrete: (range: Range, textStyle: TextStyle) => void
}
