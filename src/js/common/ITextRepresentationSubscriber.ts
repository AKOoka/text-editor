import { TextRepresentationChange } from '../core/TextRepresentation/TextRepresentationChange'

export interface ITextRepresentationSubscriber {
  updateTextRepresentation: (changes: TextRepresentationChange[]) => void
}
