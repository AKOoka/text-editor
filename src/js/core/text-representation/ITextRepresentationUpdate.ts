import { ILineContent } from './ILineContent'

export enum TextEditorRepresentationUpdateType {
  ADD,
  CHANGE,
  DELETE
}

export interface ITextRepresentationUpdate {
  y: number
  type: TextEditorRepresentationUpdateType
  lineContent?: ILineContent
}

export interface ITextRepresentationUpdateDelete extends ITextRepresentationUpdate {
  y: number
  type: TextEditorRepresentationUpdateType
}

export interface ITextRepresentationUpdateAdd extends ITextRepresentationUpdate {
  y: number
  type: TextEditorRepresentationUpdateType
  lineContent: ILineContent
}

export interface ITextRepresentationUpdateChange extends ITextRepresentationUpdate {
  y: number
  type: TextEditorRepresentationUpdateType
  lineContent: ILineContent
}
