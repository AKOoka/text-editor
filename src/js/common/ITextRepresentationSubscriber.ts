import { ITextEditorRepresentationUpdateLine } from '../core/TextRepresentation/ITextEditorRepresentationUpdateLine'

export interface ITextRepresentationSubscriber {
  updateTextRepresentation: (changes: ITextEditorRepresentationUpdateLine[]) => void
}
