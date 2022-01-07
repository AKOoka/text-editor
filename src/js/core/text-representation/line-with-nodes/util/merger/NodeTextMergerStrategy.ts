import { INodeText, NodeType, Node } from '../../nodes/Node'
import { BaseNodeMergerStrategy } from './BaseNodeMergerStrategy'
import { MergeResult, NodeMerger } from './NodeMerger'

export class NodeTextMergerStrategy extends BaseNodeMergerStrategy {
  constructor (nodeMerger: NodeMerger) {
    super(nodeMerger)

    this._nodeMergeFunction = {
      [NodeType.TEXT]: this._nodeMerger.mergeTwoNodeText,
      [NodeType.TEXT_STYLE]: this._nodeMerger.mergeNodeTextWithNodeTextStyle,
      [NodeType.CONTAINER]: this._nodeMerger.mergeNodeTextWithNodeContainer
    }
    this._nodeDataMergeFunction = {
      [NodeType.TEXT]: this._nodeMerger,
      [NodeType.TEXT_STYLE]: this._nodeMerger,
      [NodeType.CONTAINER]: this._nodeMerger
    }
  }

  mergeIfPossibleTwoNodes (leftNode: INodeText, rightNode: Node): MergeResult {
    this._nodeMergeFunction[rightNode.type](leftNode, rightNode)
  }
}
