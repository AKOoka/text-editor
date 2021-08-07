import { Node } from './nodes/INode'

export interface ILinkedNode<N extends Node = Node> {
  node: N
  next: ILinkedNode | null
  prev: ILinkedNode | null
}

export interface ILinkedNodeReadonly<N extends Node = Node> extends ILinkedNode<N> {
  node: N
  readonly next: ILinkedNode | null
  readonly prev: ILinkedNode | null
}
