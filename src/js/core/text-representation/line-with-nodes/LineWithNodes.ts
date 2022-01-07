import { PositionWithOffset } from './util/PositionWithOffset'
import { TextStyle } from '../../../common/TextStyle'
import { ITextRepresentationLine } from '../ITextRepresentationLine'
import { RangeWithOffset } from './util/RangeWithOffset'
import { NodeType } from './nodes/Node'
import { INodeActionStrategy } from './node-action-strategies/INodeActionStrategy'
import { NodeTextActionStrategy } from './node-action-strategies/NodeTextActionStrategy'
import { NodeTextStyleActionStrategy } from './node-action-strategies/NodeTextStyleActionStrategy'
import { NodeContainerActionStrategy } from './node-action-strategies/NodeContainerActionStrategy'
import { LineWithNodesContent } from './LineWithNodesContent'
import { NodeChildrenTool } from './util/NodeChildrenTool'
import { NodeCreator } from './util/NodeCreator'
import { NodeMerger } from './util/merger/NodeMerger'
import { NodeChildren } from './nodes/NodeChildren'

export class LineWithNodes implements ITextRepresentationLine {
  private _size: number
  private readonly _childNodes: NodeChildren
  private readonly _nodeAction: Record<NodeType, INodeActionStrategy>
  private readonly _nodeLayerTool: NodeChildrenTool
  private readonly _nodeCreator: NodeCreator
  private readonly _nodeMerger: NodeMerger

  constructor () {
    this._size = 0
    this._nodeCreator = new NodeCreator()
    this._nodeMerger = new NodeMerger(this._nodeCreator)
    this._nodeLayerTool = new NodeChildrenTool(this._nodeMerger, this._nodeCreator)
    this._childNodes = new NodeChildren(this._nodeCreator.createNodeText(''))

    const nodeTextActionStrategy = new NodeTextActionStrategy(this._nodeCreator, this._nodeMerger, this._nodeLayerTool)
    const nodeTextStyleActionStrategy = new NodeTextStyleActionStrategy(this._nodeCreator, this._nodeMerger, this._nodeLayerTool)

    this._nodeAction = {
      [NodeType.TEXT]: nodeTextActionStrategy,
      [NodeType.TEXT_STYLE]: nodeTextStyleActionStrategy,
      [NodeType.CONTAINER]: new NodeContainerActionStrategy(
        this._nodeCreator,
        this._nodeMerger,
        this._nodeLayerTool,
        nodeTextActionStrategy,
        nodeTextStyleActionStrategy
      )
    }
  }

  getSize (): number {
    return this._size
  }

  getContent: () => LineWithNodesContent

  getContentInRange: (range: RangeWithOffset) => LineWithNodesContent

  getTextStylesInRange (range: RangeWithOffset): TextStyle[] {
    // let textStyles: TextStyle[] = []

    // for (const { offset, index } of nodeIndexesInRange) {
    //   const node: Node = this._childNodes[index]

    //   switch (node.type) {
    //     case NodeType.CONTAINER:
    //       textStyles.push(node.style)
    //       // get from childNodes
    //       break
    //     case NodeType.TEXT_STYLE:
    //       textStyles.push(node.style)
    //       break
    //   }
    // }

    // return textStyles
  }

  addText (position: PositionWithOffset, text: string): void {
    this._size += text.length

    this._childNodes.updateNodeOnPosition(
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

  addContent (position: PositionWithOffset, content: LineWithNodesContent): void {
    this._size += content.getSize()

    // this._nodeLayerTool.updateNodeOnPosition(
    //   this._childNodes,
    //   position,
    //   (nodeLayer, nodeIndex, offset) => {
    //     this._nodeAction[nodeLayer[nodeIndex].type].addContent(
    //       nodeLayer,
    //       nodeIndex,
    //       position.copy(position.position, offset),
    //       content
    //     )
    //   }
    // )
  }

  addTextStyle (range: RangeWithOffset, textStyle: TextStyle): void {
    this._childNodes.updateNodesInRange(
      range,
      (linkedNode, offset) => {
        this._nodeAction[linkedNode.node.type].addTextStyle(
          this._childNodes,
          linkedNode,
          range.copy().setOffset(offset),
          textStyle
        )
      }
    )
  }

  deleteText (range: RangeWithOffset): void {
    this._size -= range.width

    this._childNodes.updateNodesInRange(
      range,
      (linkedNode, offset) => {
        this._nodeAction[linkedNode.node.type].deleteText(
          this._childNodes,
          linkedNode,
          range.copy().setOffset(offset)
        )
      }
    )
  }

  deleteTextStyleAll (range: RangeWithOffset): void {
    this._childNodes.updateNodesInRange(
      range,
      (linkedNode, offset) => {
        this._nodeAction[linkedNode.node.type].deleteTextStyleAll(
          this._childNodes,
          linkedNode,
          range.copy().setOffset(offset)
        )
      }
    )
  }

  deleteTextStyleConcrete (range: RangeWithOffset, textStyle: TextStyle): void {
    this._childNodes.updateNodesInRange(
      range,
      (linkedNode, offset) => {
        this._nodeAction[linkedNode.node.type].deleteTextStyle(
          this._childNodes,
          linkedNode,
          range.copy().setOffset(offset),
          textStyle
        )
      }
    )
  }
}
