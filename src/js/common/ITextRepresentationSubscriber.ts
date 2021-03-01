import { ITextRepresentationChanges } from './ITextRepresentationChanges'

export interface ITextRepresentationSubscriber<ChangedLines> {
  updateTextRepresentation: (changes: ITextRepresentationChanges<ChangedLines>) => void
}
