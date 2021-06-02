import { NodeUpdatesManager } from './NodeUpdatesManager'

export enum TextEditorRepresentationUpdateLineType {
  ADD,
  CHANGE,
  DELETE
}

export interface ITextEditorRepresentationUpdateLine {
  type: TextEditorRepresentationUpdateLineType
  y: number
  nodeUpdateManager?: NodeUpdatesManager
}

class TextEditorRepresentationUpdateManager {
  private readonly _updates: Map<number, ITextEditorRepresentationUpdateLine[]>

  constructor () {
    this._updates = new Map()
  }

  addUpdateLineDelete (y: number, offset: number): void {
    this._updates.set(
      y,
      [{ type: TextEditorRepresentationUpdateLineType.DELETE, y: y + offset }]
    )
  }

  addUpdateLineAdd (y: number, offset: number): void {
    const u: ITextEditorRepresentationUpdateLine[] | undefined = this._updates.get(y)
    const update: ITextEditorRepresentationUpdateLine = {
      type: TextEditorRepresentationUpdateLineType.ADD,
      y: y + offset
    }

    if (u === undefined) {
      this._updates.set(y, [update])
      return
    }
    u.push(update)
  }

  addUpdateLineChange (y: number, offset: number, routeToNodeUpdate: number[]): void {
    const u: ITextEditorRepresentationUpdateLine[] | undefined = this._updates.get(y)
    const update: ITextEditorRepresentationUpdateLine = {
      type: TextEditorRepresentationUpdateLineType.CHANGE,
      y: y + offset,
      routeToNodeUpdate
    }

    if (u === undefined) {
      this._updates.set(y, [update])
      return
    }
    u.push(update)
  }

  getUpdates (): ITextEditorRepresentationUpdateLine[] {
    const a = []
    for (const update of this._updates.values()) {
      a.push(...update)
    }
    return a
  }
}

export { TextEditorRepresentationUpdateManager }
