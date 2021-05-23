import { TextRepresentationAction } from './TextRepresentationAction'
import { NodeRepresentation } from './Nodes/NodeRepresentation'

class TextRepresentationChange {
  private _action: TextRepresentationAction
  private _position: number
  private _nodeRepresentation: NodeRepresentation

  setAction (action: TextRepresentationAction): TextRepresentationChange {
    this._action = action
    return this
  }

  getAction (): TextRepresentationAction {
    return this._action
  }

  setPosition (position: number): TextRepresentationChange {
    this._position = position
    return this
  }

  getPosition (): number {
    return this._position
  }

  setNodeRepresentation (nodeRepresentation: NodeRepresentation): TextRepresentationChange {
    this._nodeRepresentation = nodeRepresentation
    return this
  }

  getNodeRepresentation (): NodeRepresentation {
    return this._nodeRepresentation
  }
}

export { TextRepresentationChange }
