import { ITextEditorRepresentationUpdate } from '../core/text-representation/ITextEditorRepresentationUpdate'

export interface ITextRepresentationSubscriber {
  updateTextRepresentation: (changes: ITextEditorRepresentationUpdate[]) => void
}
