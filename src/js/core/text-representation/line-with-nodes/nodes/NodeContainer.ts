import { TextStyle } from '../../../../common/TextStyle'
import { NodeChildren } from './NodeChildren'
import { INodeContainer, NodeType } from './Node'

export class NodeContainer implements INodeContainer {
  private readonly _type: NodeType.CONTAINER
  // private _size: number
  private readonly _style: TextStyle
  private _childNodes: NodeChildren

  get type (): NodeType.CONTAINER {
    return this._type
  }

  get size (): number {
    // TODO: need to save size after change
    let size: number = 0

    for (const { node } of this._childNodes) {
      size += node.size
    }

    return size
  }

  get style (): TextStyle {
    return this._style
  }

  get childNodes (): NodeChildren {
    return this._childNodes
  }

  set childNodes (value: NodeChildren) {
    this._childNodes = value
  }

  constructor (style: TextStyle, childNodes: NodeChildren) {
    this._type = NodeType.CONTAINER
    this._style = style
    this._childNodes = childNodes
  }
}
