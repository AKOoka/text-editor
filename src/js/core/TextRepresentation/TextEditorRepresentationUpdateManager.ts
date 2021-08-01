import { TextEditorRepresentationUpdateType, ITextEditorRepresentationUpdate } from './ITextEditorRepresentationUpdate'

interface ILineUpdate {
  offset: number
  type: TextEditorRepresentationUpdateType
}

class TextEditorRepresentationUpdateManager {
  private readonly _lineUpdates: Map<number, ILineUpdate>

  constructor () {
    this._lineUpdates = new Map()
  }

  addUpdateLineDelete (y: number, offset: number): void {
    this._lineUpdates.set(y, { offset, type: TextEditorRepresentationUpdateType.DELETE })
  }

  addUpdateLineAdd (y: number, offset: number): void {
    const u: ILineUpdate | undefined = this._lineUpdates.get(y)
    if (u === undefined) {
      this._lineUpdates.set(y, { offset, type: TextEditorRepresentationUpdateType.ADD })
    }
  }

  addUpdateLineChange (y: number, offset: number): void {
    const u: ILineUpdate | undefined = this._lineUpdates.get(y)
    if (u === undefined) {
      this._lineUpdates.set(y, { offset, type: TextEditorRepresentationUpdateType.CHANGE })
    }
  }

  getUpdates (): ITextEditorRepresentationUpdate[] {
    const lineUpdates: ITextEditorRepresentationUpdate[] = []
    for (const [y, update] of this._lineUpdates.entries()) {
      lineUpdates.push({ y: y + update.offset, type: update.type })
    }

    return lineUpdates
  }
}

export { TextEditorRepresentationUpdateManager }
