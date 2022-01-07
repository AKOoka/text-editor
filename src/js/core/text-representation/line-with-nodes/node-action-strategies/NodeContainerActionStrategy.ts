import { TextStyle } from '../../../../common/TextStyle'
import { Node, INodeContainer, NodeType } from '../nodes/Node'
import { INodeActionStrategy } from './INodeActionStrategy'
import { NodeContainer } from '../nodes/NodeContainer'
import { NodeCreator } from '../util/NodeCreator'
import { NodeChildrenTool } from '../util/NodeChildrenTool'
import { NodeMerger } from '../util/merger/NodeMerger'
import { NodeTextActionStrategy } from './NodeTextActionStrategy'
import { NodeTextStyleActionStrategy } from './NodeTextStyleActionStrategy'
import { PositionWithOffset } from '../util/PositionWithOffset'
import { RangeWithOffset } from '../util/RangeWithOffset'
import { LinkedNode } from '../LinkedNode'
import { ILinkedNode } from '../ILinkedNode'

export class NodeContainerActionStrategy implements INodeActionStrategy {
  private readonly _nodeCreator: NodeCreator
  private readonly _nodeMerger: NodeMerger
  private readonly _nodeLayerTool: NodeChildrenTool
  private readonly _nodeAction: Record<NodeType, INodeActionStrategy>

  constructor (
    nodeCreator: NodeCreator,
    nodeMerger: NodeMerger,
    nodeLayerTool: NodeChildrenTool,
    nodeTextActionStrategy: NodeTextActionStrategy,
    nodeTextStyleActionStrategy: NodeTextStyleActionStrategy
  ) {
    this._nodeMerger = nodeMerger
    this._nodeCreator = nodeCreator
    this._nodeLayerTool = nodeLayerTool
    this._nodeAction = {
      [NodeType.TEXT]: nodeTextActionStrategy,
      [NodeType.TEXT_STYLE]: nodeTextStyleActionStrategy,
      [NodeType.CONTAINER]: this
    }
  }

  addText (linkedNode: LinkedNode, position: PositionWithOffset, text: string): void {
    const { node } = linkedNode as ILinkedNode<INodeContainer>
    node.size += text.length

    node.childNodes.updateNodeOnPosition(
      position,
      (linkedNode, offset) => {
        this._nodeAction[linkedNode.node.type].addText(
          linkedNode,
          position.copy(position.position, offset),
          text
        )
      }
    )
  }

  addTextStyle (nodeLayer: INode[], nodeIndex: number, range: RangeWithOffset, textStyle: TextStyle): void {
    const nodeContainer: INodeContainer = nodeLayer[nodeIndex] as INodeContainer

    if (nodeContainer.style.deepCompare(textStyle)) {
      return
    } else if (range.isNodeInsideRange(nodeContainer.size)) {
      nodeLayer.splice(nodeIndex, 1, new NodeContainer(textStyle, [nodeContainer]))
      return
    }

    this._nodeLayerTool.updateNodesInRange(
      nodeContainer.childNodes,
      range,
      (nodeIndex, offset) => {
        this._nodeAction[nodeContainer.childNodes[nodeIndex].type].addTextStyle(
          nodeContainer.childNodes,
          nodeIndex,
          range.copy().setOffset(offset),
          textStyle
        )
      }
    )
  }

  deleteText (nodeLayer: INode[], nodeIndex: number, range: RangeWithOffset): void {
    const nodeContainer: INodeContainer = nodeLayer[nodeIndex] as INodeContainer

    if (range.isNodeInsideRange(nodeContainer.size)) {
      nodeLayer.splice(nodeIndex, 1)
      return
    }

    nodeContainer.size -= range.getNodeWidthInRange(nodeContainer.size)

    this._nodeLayerTool.updateNodesInRange(
      nodeContainer.childNodes,
      range,
      (nodeIndex, offset) => {
        this._nodeAction[nodeContainer.childNodes[nodeIndex].type].deleteText(
          nodeContainer.childNodes,
          nodeIndex,
          range.copy().setOffset(offset)
        )
      }
    )
  }

  private _getTextFromChildNodes (nodeContainer: INodeContainer): string {
    let text: string = ''

    for (const childNode of nodeContainer.childNodes) {
      if (childNode.type === NodeType.CONTAINER) {
        text += this._getTextFromChildNodes(childNode)
      } else {
        text += childNode.text
      }
    }

    return text
  }

  deleteTextStyleAll (nodeLayer: INode[], nodeIndex: number, range: RangeWithOffset): void {
    const nodeContainer: INodeContainer = nodeLayer[nodeIndex] as INodeContainer

    if (range.isNodeInsideRange(nodeContainer.size)) {
      nodeLayer.splice(
        nodeIndex,
        1,
        this._nodeCreator.createNodeText(this._getTextFromChildNodes(nodeContainer))
      )
      return
    }

    // TODO: need to shrink nodeContainer part without styles add nodeLayer
    this._nodeLayerTool.updateNodesInRange(
      nodeContainer.childNodes,
      range,
      (nodeIndex, offset) => {
        this._nodeAction[nodeContainer.childNodes[nodeIndex].type].deleteTextStyleAll(
          nodeContainer.childNodes,
          nodeIndex,
          range.copy().setOffset(offset)
        )
      }
    )
  }

  deleteTextStyle (nodeLayer: INode[], nodeIndex: number, range: RangeWithOffset, textStyle: TextStyle): void {
    const nodeContainer: INodeContainer = nodeLayer[nodeIndex] as INodeContainer

    if (!nodeContainer.style.deepCompare(textStyle)) {
      this._nodeLayerTool.updateNodesInRange(
        nodeContainer.childNodes,
        range,
        (nodeIndex, offset) => {
          this._nodeAction[nodeContainer.childNodes[nodeIndex].type].deleteTextStyleConcrete(
            nodeContainer.childNodes,
            nodeIndex,
            range.copy().setOffset(offset),
            textStyle
          )
        }
      )

      return
    }

    if (range.isNodeInsideRange(nodeContainer.size)) {
      nodeLayer.splice(nodeIndex, 1, ...nodeContainer.childNodes)
    } else if (range.isRangeInsideNode(nodeContainer.size)) {
    } else if (range.isNodeStartInRange(nodeContainer.size)) {
    } else if (range.isNodeEndInRange(nodeContainer.size)) {
    }
  }
}
