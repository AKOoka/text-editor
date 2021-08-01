import { ITextEditorRepresentationUpdate } from '../core/TextRepresentation/ITextEditorRepresentationUpdate';

export interface ITextRepresentationSubscriber {
  updateTextRepresentation: (changes: ITextEditorRepresentationUpdate[]) => void
}
