import { LineUpdates } from './LineUpdates'
import { NodeRepresentation } from './Nodes/NodeRepresentation'

export enum TextEditorRepresentationUpdateLineType {
  ADD,
  CHANGE,
  DELETE
}

export interface ITextEditorRepresentationUpdateLine {
  y: number
  type: TextEditorRepresentationUpdateLineType
  nodeLineRepresentation?: NodeRepresentation
}

export interface ITextEditorRepresentationUpdateLineDelete extends ITextEditorRepresentationUpdateLine {
  y: number
  type: TextEditorRepresentationUpdateLineType
}

export interface ITextEditorRepresentationUpdateLineAdd extends ITextEditorRepresentationUpdateLine {
  y: number
  type: TextEditorRepresentationUpdateLineType
  nodeLineRepresentation: NodeRepresentation
}

export interface ITextEditorRepresentationUpdateLineChange extends ITextEditorRepresentationUpdateLine {
  y: number
  type: TextEditorRepresentationUpdateLineType
  nodeLineRepresentation: NodeRepresentation
}

class TextEditorRepresentationUpdateManager {
  private readonly _lineUpdates: Map<number, LineUpdates>

  constructor () {
    this._lineUpdates = new Map()
  }

  addUpdateLineDelete (y: number, offset: number): void {
    this._lineUpdates.set(y, new LineUpdates(offset, TextEditorRepresentationUpdateLineType.DELETE))
  }

  addUpdateLineAdd (y: number, offset: number): void {
    const u: LineUpdates | undefined = this._lineUpdates.get(y)
    if (u === undefined) {
      this._lineUpdates.set(y, new LineUpdates(offset, TextEditorRepresentationUpdateLineType.ADD))
    }
  }

  addUpdateLineChange (y: number, offset: number): void {
    const u: LineUpdates | undefined = this._lineUpdates.get(y)
    if (u === undefined) {
      this._lineUpdates.set(y, new LineUpdates(offset, TextEditorRepresentationUpdateLineType.CHANGE))
    }
  }

  getUpdates (): ITextEditorRepresentationUpdateLineDelete[] {
    const lineUpdates: ITextEditorRepresentationUpdateLineDelete[] = []
    for (const [y, update] of this._lineUpdates.entries()) {
      lineUpdates.push({ y: y + update.offset, type: update.type })
    }

    return lineUpdates
  }
}

export { TextEditorRepresentationUpdateManager }
