import { ILineContent } from './ILineContent'

export enum TextEditorRepresentationUpdateType {
  ADD,
  CHANGE,
  DELETE
}

export interface ITextEditorRepresentationUpdate {
  y: number
  type: TextEditorRepresentationUpdateType
  lineContent?: ILineContent
}

export interface ITextEditorRepresentationUpdateDelete extends ITextEditorRepresentationUpdate {
  y: number
  type: TextEditorRepresentationUpdateType
}

export interface ITextEditorRepresentationUpdateAdd extends ITextEditorRepresentationUpdate {
  y: number
  type: TextEditorRepresentationUpdateType
  lineContent: ILineContent
}

export interface ITextEditorRepresentationUpdateChange extends ITextEditorRepresentationUpdate {
  y: number
  type: TextEditorRepresentationUpdateType
  lineContent: ILineContent
}
