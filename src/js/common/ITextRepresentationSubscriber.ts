import { ITextEditorRepresentationUpdate } from '../core/TextRepresentation/TextEditorRepresentationUpdateManager'

export interface ITextRepresentationSubscriber {
  updateTextRepresentation: (changes: ITextEditorRepresentationUpdate[]) => void
}
