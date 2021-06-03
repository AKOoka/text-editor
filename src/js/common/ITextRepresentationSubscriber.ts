import { ITextEditorRepresentationUpdateLine } from '../core/TextRepresentation/TextEditorRepresentationUpdateManager'

export interface ITextRepresentationSubscriber {
  updateTextRepresentation: (changes: ITextEditorRepresentationUpdateLine[]) => void
}
