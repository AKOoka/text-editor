import { ITextRepresentationUpdate } from '../core/text-representation/ITextRepresentationUpdate'

export interface ITextRepresentationSubscriber {
  updateTextRepresentation: (changes: ITextRepresentationUpdate[]) => void
}
