import { INodeUpdate, NodeUpdatesManager } from './NodeUpdatesManager'
import { LineUpdates } from './LineUpdates'

export enum TextEditorRepresentationUpdateLineType {
  ADD,
  CHANGE,
  DELETE
}

export interface ITextEditorRepresentationUpdateLine {
  y: number
  type: TextEditorRepresentationUpdateLineType
  nodeUpdates?: INodeUpdate[]
}

class TextEditorRepresentationUpdateManager {
  private readonly _updates: Map<number, LineUpdates>

  constructor () {
    this._updates = new Map()
  }

  addUpdateLineDelete (y: number, offset: number): void {
    this._updates.set(y, new LineUpdates(offset, [{ type: TextEditorRepresentationUpdateLineType.DELETE }]))
  }

  addUpdateLineAdd (y: number, offset: number): void {
    const u: LineUpdates | undefined = this._updates.get(y)
    if (u === undefined) {
      this._updates.set(y, new LineUpdates(offset, [{ type: TextEditorRepresentationUpdateLineType.ADD }]))
      return
    }
    u.addUpdate({ type: TextEditorRepresentationUpdateLineType.ADD })
  }

  addUpdateLineChange (y: number, offset: number, nodeUpdatesManager: NodeUpdatesManager): void {
    const u: LineUpdates | undefined = this._updates.get(y)

    if (u === undefined) {
      this._updates.set(y, new LineUpdates(offset, [{ type: TextEditorRepresentationUpdateLineType.CHANGE, nodeUpdatesManager }]))
      return
    }
    u.addUpdate({ type: TextEditorRepresentationUpdateLineType.CHANGE, nodeUpdatesManager })
  }

  getUpdates (): ITextEditorRepresentationUpdateLine[] {
    let lineUpdates: ITextEditorRepresentationUpdateLine[] = []
    for (const [y, updates] of this._updates.entries()) {
      const position: number = y + updates.offset
      lineUpdates = lineUpdates.concat(
        updates.updates.map(u => { return { y: position, type: u.type, updates: u.nodeUpdatesManager?.nodeUpdates } })
      )
    }

    return lineUpdates
  }
}

export { TextEditorRepresentationUpdateManager }
