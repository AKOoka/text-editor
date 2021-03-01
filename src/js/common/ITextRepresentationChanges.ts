import { TextStyleType } from './TextStyleType'

export interface ITextRepresentationChanges<LineChange> {
  lineChanges: LineChange
  activeStyles: TextStyleType[]
}
