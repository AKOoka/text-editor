import { NodeRepresentation } from './NodeRepresentation'
import { INode } from './INode'

export enum TextEditorRepresentationUpdateNodeType {
  CHANGE,
  ADD,
  DELETE
}

export interface INodeUpdate {
  route: number[]
  type: TextEditorRepresentationUpdateNodeType
  added?: boolean
  content?: NodeRepresentation
}

export interface INodeUpdateAdd extends INodeUpdate{
  route: number[]
  type: TextEditorRepresentationUpdateNodeType
  content: NodeRepresentation
}

export interface INodeUpdateDelete extends INodeUpdate {
  route: number[]
  type: TextEditorRepresentationUpdateNodeType
}

export interface INodeUpdateChange extends INodeUpdate {
  route: number[]
  type: TextEditorRepresentationUpdateNodeType
  content: NodeRepresentation
}

class NodeUpdatesManager {
  private _route: number[]
  private _nodeUpdates: Map<INode, INodeUpdate>

  constructor () {
    this._route = []
    this._nodeUpdates = new Map()
  }

  get nodeUpdates (): INodeUpdate[] {
    return [...this._nodeUpdates.values()]
  }

  addPath (position: number): void {
    this._route.push(position)
  }

  endPath (): void {
    this._route.pop()
  }

  nodeAdd (node: INode): void {
    this._nodeUpdates.set(node, { route: [...this._route], type: TextEditorRepresentationUpdateNodeType.ADD, added: true, content: node.getRepresentation() })
  }

  nodeDelete (node: INode): void {
    const update = this._nodeUpdates.get(node)
    if (update !== undefined && update.added === true) {
      this._nodeUpdates.delete(node)
    }
    this._nodeUpdates.set(node, { route: [...this._route], type: TextEditorRepresentationUpdateNodeType.DELETE })
  }

  nodeChange (nodes: INode[]): void {
    const update = this._nodeUpdates.get(nodes[0])
    if (update !== undefined && update.added === true) {
      this._nodeUpdates.set(nodes[0], {
        route: [...this._route],
        added: update.added,
        type: TextEditorRepresentationUpdateNodeType.ADD,
        content: nodes[0].getRepresentation()
      })
    } else {
      this._nodeUpdates.set(nodes[0], {
        route: [...this._route],
        added: true,
        type: TextEditorRepresentationUpdateNodeType.CHANGE,
        content: nodes[0].getRepresentation()
      })
    }

    for (let i = 1; i < nodes.length; i++) {
      this._route[this._route.length - 1]++
      this._nodeUpdates.set(nodes[i], {
        route: [...this._route],
        added: true,
        type: TextEditorRepresentationUpdateNodeType.ADD,
        content: nodes[i].getRepresentation()
      })
    }
  }

  clear (): void {
    this._route = []
    this._nodeUpdates = new Map()
  }
}

export { NodeUpdatesManager }
