import { TextEditorRepresentationUpdateLineType } from './TextEditorRepresentationUpdateManager'

export class LineUpdates {
  private readonly _offset: number
  private readonly _type: TextEditorRepresentationUpdateLineType

  constructor (offset: number, type: TextEditorRepresentationUpdateLineType) {
    this._offset = offset
    this._type = type
  }

  get offset (): number {
    return this._offset
  }

  get type (): TextEditorRepresentationUpdateLineType {
    return this._type
  }
}
