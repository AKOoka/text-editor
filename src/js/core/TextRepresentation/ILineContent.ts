import { ILineWithStylesContent } from './LineWithStyles/LineWithStylesContent'

export interface ILineContent<Content = ILineWithStylesContent> {
  getContent: () => Content
  getSize: () => number
}
