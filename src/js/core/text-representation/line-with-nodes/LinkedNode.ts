import { ILinkedNode } from './ILinkedNode'
import { Node } from './nodes/INode'

export class LinkedNode implements ILinkedNode {
  private _node: Node
  private _next: ILinkedNode | null
  private _prev: ILinkedNode | null

  get node (): Node {
    return this._node
  }

  set node (value: Node) {
    this._node = value
  }

  get next (): ILinkedNode | null {
    return this._next
  }

  set next (value: ILinkedNode | null) {
    this._next = value
  }

  get prev (): ILinkedNode | null {
    return this._prev
  }

  set prev (value: ILinkedNode | null) {
    this._prev = value
  }

  constructor (node: Node, next: ILinkedNode | null = null, prev: ILinkedNode | null = null) {
    this._node = node
    this._next = next
    this._prev = prev
  }
}
