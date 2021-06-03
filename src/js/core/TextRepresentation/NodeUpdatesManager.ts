import { NodeRepresentation } from './NodeRepresentation'

export enum TextEditorRepresentationUpdateNodeType {
  CHANGE,
  ADD,
  DELETE
}

export interface INodeUpdate {
  route: number[]
  type: TextEditorRepresentationUpdateNodeType
  content?: NodeRepresentation[]
}

class NodeUpdatesManager {
  private readonly _route: number[]
  private _nodeUpdates: INodeUpdate[]
  private _saveStart: number
  private _saveEnd: number

  constructor () {
    this._route = []
    this._nodeUpdates = []
  }

  get nodeUpdates (): INodeUpdate[] {
    return this._nodeUpdates
  }

  savePositionInRoute (): void {
    this._saveStart = this._nodeUpdates.length
  }

  mergeUpdatesFromSavedPosition (): void {
    const mergedContent: NodeRepresentation[] = []
    for (let i = this._saveStart; i <= this._saveEnd; i++) {
      if (this._nodeUpdates[i].type === TextEditorRepresentationUpdateNodeType.DELETE) {
        continue
      }
      mergedContent.concat(this._nodeUpdates[i].content as NodeRepresentation[])
    }
    this._nodeUpdates = this._nodeUpdates
      .slice(this._saveStart, this._saveEnd)
      .concat(
        { route: this._route, type: TextEditorRepresentationUpdateNodeType.CHANGE, content: mergedContent },
        this._nodeUpdates.slice(this._saveEnd)
      )
  }

  addPath (position: number): void {
    this._saveEnd = this._nodeUpdates.length - 1
    this._route.push(position)
  }

  endPath (): void {
    this._route.pop()
  }

  addNodeUpdate (type: TextEditorRepresentationUpdateNodeType, content?: NodeRepresentation[]): void {
    this._nodeUpdates.push({ route: this._route, type, content })
  }
}

export { NodeUpdatesManager }
