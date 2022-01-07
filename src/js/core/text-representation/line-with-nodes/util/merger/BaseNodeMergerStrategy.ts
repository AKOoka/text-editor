import { MergeResult, NodeMerger } from './NodeMerger'
import { Node } from '../../nodes/Node'
import { NodeType } from '../../../Nodes/INode'

export type NodeMergeFunction = (leftNode: Node, rightNode: Node) => Node
export type NodeDataMergeFunction = (leftNode: Node, rightNode: Node) => Node

export abstract class BaseNodeMergerStrategy {
  protected readonly _nodeMerger: NodeMerger
  protected readonly _nodeMergeFunction: Record<NodeType, NodeMergeFunction>
  protected readonly _nodeDataMergeFunction: Record<NodeType, NodeDataMergeFunction>

  constructor (nodeMerger: NodeMerger) {
    this._nodeMerger = nodeMerger
  }

  abstract mergeIfPossibleTwoNodes (leftNode: Node, rightNode: Node): MergeResult
}
