import { Node } from './Node'
import { LinkedNode } from '../LinkedNode'
import { ILinkedNode, ILinkedNodeReadonly } from '../ILinkedNode'
import { PositionWithOffset } from '../util/PositionWithOffset'
import { RangeWithOffset } from '../util/RangeWithOffset'

export type UpdateNodeCallback = (linkedNode: ILinkedNodeReadonly, offset: number) => void

// TODO: make feature for node layer to work with multiple nodes
export class NodeChildren {
  private _firstNode: ILinkedNode
  private _lastNode: ILinkedNode

  get firstNode (): ILinkedNode {
    return this._firstNode
  }

  get lastNode (): ILinkedNode {
    return this._lastNode
  }

  constructor (node: Node) {
    this._firstNode = new LinkedNode(node)
    this._lastNode = this._firstNode
  }

  * [Symbol.iterator] (): IterableIterator<ILinkedNodeReadonly> {
    let curNode: ILinkedNode = this._firstNode

    while (curNode.next !== null) {
      yield curNode
      curNode = curNode.next
    }
  }

  updateNodesInRange (range: RangeWithOffset, updateNodeCallback: UpdateNodeCallback): void {
    let offset: number = 0

    for (const linkedNode of this) {
      if (range.childNodeInRange(offset, linkedNode.node.size)) {
        updateNodeCallback(linkedNode, offset)
      }

      offset += linkedNode.node.size
    }
  }

  updateNodeOnPosition (position: PositionWithOffset, updateNodeCallback: UpdateNodeCallback): void {
    let offset: number = 0

    for (const linkedNode of this) {
      if (position.childNodeInPosition(offset, linkedNode.node.size)) {
        updateNodeCallback(linkedNode, offset)
        return
      }

      offset += linkedNode.node.size
    }

    console.log('node layer', this)
    throw new Error(`can't get node on position: ${position.position} with offset: ${position.offset}`)
  }

  mergeWithNodeLayer (nodeLayer: NodeChildren): void {
    nodeLayer.firstNode.prev = this._lastNode
    this._lastNode.next = nodeLayer.firstNode
    this._lastNode = nodeLayer.lastNode
  }

  delete (node: ILinkedNode): void {
    if (node.prev === null) {
      this.shift()
      return
    }

    if (node.next === null) {
      this.pop()
      return
    }

    node.prev.next = node.next
    node.next.prev = node.prev
  }

  addAfter (node: ILinkedNode, newNode: Node): void {
    // TODO: should add functionality to add multiple newNodes
    if (node.next === null) {
      this.push(newNode)
      return
    }

    const newLinkedNode: ILinkedNode = new LinkedNode(newNode, node.next, node)
    node.next.prev = newLinkedNode
    node.next = newLinkedNode
  }

  addBefore (node: ILinkedNode, newNode: Node): void {
    if (node.prev === null) {
      this.unshift(newNode)
      return
    }

    const newLinkedNode: ILinkedNode = new LinkedNode(newNode, node, node.prev)
    node.prev.next = newLinkedNode
    node.prev = newLinkedNode
  }

  push (newNode: Node): void {
    this._lastNode.next = new LinkedNode(newNode, null, this._lastNode)
    this._lastNode = this._lastNode.next
  }

  pop (): void {
    if (this._lastNode.prev === null) {
      return
    }

    this._lastNode.prev.next = null
    this._lastNode = this._lastNode.prev
  }

  unshift (newNode: Node): void {
    this._firstNode.prev = new LinkedNode(newNode, this._firstNode)
    this._firstNode = this._firstNode.prev
  }

  shift (): void {
    if (this._firstNode.next === null) {
      return
    }

    this._firstNode.next.prev = null
    this._firstNode = this._firstNode.next
  }
}
