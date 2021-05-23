import { TextStyleType } from './TextStyleType'
import { TextRepresentationChange } from '../core/TextRepresentation/TextRepresentationChange'

export interface ITextRepresentationSubscriber {
  updateLineChanges: (changes: TextRepresentationChange[]) => void
  updateActiveTextStyles: (activeTextStyles: TextStyleType[]) => void
}
