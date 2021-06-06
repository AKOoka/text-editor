import { INode, INodeCopy } from './INode'
import { TextStyleType } from '../../../common/TextStyleType'
import { BaseNodeContainer, ChildNodeInRangeCallback } from './BaseNodeContainer'
import { NodeRepresentation, NodeRepresentationType } from './NodeRepresentation'
import { PositionNode } from './PositionNode'
import { RangeNode } from './RangeNode'
import { NodeType } from './NodeType'
import { NodeUpdatesManager } from './NodeUpdatesManager'
import { CreatedContent } from './CreatedContent'

class NodeContainerStyle extends BaseNodeContainer {
  private readonly _textStyle: TextStyleType

  constructor (childNodes: INode[], textStyle: TextStyleType) {
    super(childNodes)
    this._textStyle = textStyle
    this._representation.representationType = NodeRepresentationType.TEXT
  }

  getStyle (): TextStyleType {
    return this._textStyle
  }

  getNodeType (): NodeType {
    return NodeType.CONTAINER_STYLE
  }

  addTextStyle (range: RangeNode, textStyle: TextStyleType, nodeUpdatesManager: NodeUpdatesManager): INode[] {
    if (textStyle === this._textStyle) {
      nodeUpdatesManager.endPath()
      return [this]
    } else if (range.nodeInsideRange(this.getSize())) {
      const newNode = new NodeContainerStyle([this], textStyle)
      nodeUpdatesManager.nodeChange([newNode])
      nodeUpdatesManager.endPath()
      return [newNode]
    }

    const childNodeInRange: ChildNodeInRangeCallback<TextStyleType> =
      (range, childNode, textStyleType) => childNode.addTextStyle(range, textStyleType, nodeUpdatesManager)
    this._childNodes = this._updateChildNodesInRange<TextStyleType>(childNodeInRange, range, textStyle, nodeUpdatesManager)

    return [this]
  }

  deleteAllTextStyles (range: RangeNode, nodeUpdatesManager: NodeUpdatesManager): INode[] {
    if (range.nodeInsideRange(this.getSize())) {
      const newNode = this._nodeMerger.mergeNodesToNodeText(this._childNodes)
      nodeUpdatesManager.nodeChange([this])
      nodeUpdatesManager.endPath()
      return [newNode]
    }

    const childNodeInRange: ChildNodeInRangeCallback<null> =
      (range, childNode) => childNode.deleteAllTextStyles(range, nodeUpdatesManager)
    this._childNodes = this._updateChildNodesInRange<null>(childNodeInRange, range, null, nodeUpdatesManager)

    return [this]
  }

  private _findLeftNodeIndexInRange (range: RangeNode): number {
    let childStartOffset: number = range.offset

    for (let i = 0; i < this._childNodes.length; i++) {
      const childNodeSize: number = this._childNodes[i].getSize()

      if (range.childNodeInRange(childStartOffset, childNodeSize)) {
        return i
      }

      childStartOffset += childNodeSize
    }

    throw new Error("couldn't find left node to split NodeStyleContainer")
  }

  private _findRightNodeIndexInRange (range: RangeNode): number {
    let childStartOffset: number = range.offset + this.getSize()

    for (let i = this._childNodes.length - 1; i >= 0; i--) {
      const childNodeSize: number = this._childNodes[i].getSize()

      if (range.childNodeInRange(childStartOffset, childNodeSize)) {
        return i
      }

      childStartOffset -= childNodeSize
    }

    throw new Error("couldn't find right node to split NodeStyleContainer")
  }

  deleteConcreteTextStyle (range: RangeNode, textStyle: TextStyleType, nodeUpdateManager: NodeUpdatesManager): INode[] {
    if (textStyle === this._textStyle) {
      // temporary solution - NEED TO REFACTOR
      let newNodes: INode[] = []

      if (range.nodeInsideRange(this.getSize())) {
        newNodes = this._childNodes
      } else if (range.rangeInsideNode(this.getSize())) {
        const leftNodeIndexInRange: number = this._findLeftNodeIndexInRange(range)
        const rightNodeIndexInRange: number = this._findRightNodeIndexInRange(range)
        const rightNodeStyleContainer: INode = new NodeContainerStyle(
          this._childNodes.slice(rightNodeIndexInRange), this._textStyle
        )
        const nodesWithoutStyleContainer: INode[] = this._childNodes.slice(leftNodeIndexInRange, rightNodeIndexInRange)
        this._childNodes = this._childNodes.slice(0, leftNodeIndexInRange)
        newNodes = ([this] as INode[]).concat(nodesWithoutStyleContainer, rightNodeStyleContainer)
      } else if (range.nodeStartInRange(this.getSize())) {
        const rightNodeIndexInRange: number = this._findRightNodeIndexInRange(range)
        const nodesWithoutStyleContainer: INode[] = this._childNodes.slice(rightNodeIndexInRange)
        this._childNodes = this._childNodes.slice(0, rightNodeIndexInRange)
        newNodes = ([this] as INode[]).concat(nodesWithoutStyleContainer)
      } else if (range.nodeEndInRange(this.getSize())) {
        const leftNodeIndexInRange: number = this._findLeftNodeIndexInRange(range)
        const nodesWithoutStyleContainer: INode[] = this._childNodes.slice(0, leftNodeIndexInRange)
        this._childNodes = this._childNodes.slice(leftNodeIndexInRange)
        newNodes = nodesWithoutStyleContainer.concat([this])
      }

      nodeUpdateManager.nodeChange(newNodes)
      nodeUpdateManager.endPath()

      return newNodes
    }

    const childNodeInRange: ChildNodeInRangeCallback<TextStyleType> =
      (range, childNode, textStyle) => childNode.deleteConcreteTextStyle(range, textStyle, nodeUpdateManager)
    this._childNodes = this._updateChildNodesInRange<TextStyleType>(childNodeInRange, range, textStyle, nodeUpdateManager)

    return [this]
  }

  getTextStylesInRange (range: RangeNode): TextStyleType[] {
    let startOffset: number = range.offset

    if (range.childNodeInRange(startOffset, this.getSize())) {
      let textStyles: TextStyleType[] = [this._textStyle]

      for (const childNode of this._childNodes) {
        textStyles = textStyles.concat(childNode.getTextStylesInRange(new RangeNode(startOffset, range.initStart, range.initEnd)))
        startOffset += childNode.getSize()
      }

      return textStyles
    }

    return []
  }

  addContent (position: PositionNode, content: INodeCopy[], parentTextStyles: TextStyleType[], nodeUpdatesManager: NodeUpdatesManager): CreatedContent {
    parentTextStyles.push(this._textStyle)
    const { nodes, nodeStyles } = super.addContent(position, content, parentTextStyles, nodeUpdatesManager)
    for (const style of nodeStyles) {
      this._childStyles.add(style)
    }
    nodeUpdatesManager.endPath()
    return { nodes, nodeStyles }
  }

  getContent (): INodeCopy[] {
    const children = super.getContent()
    return [{
      type: NodeType.CONTAINER_LINE,
      size: children.reduce((p, c) => p + c.size, 0),
      props: { textStyle: this._textStyle, children }
    }]
  }

  getContentInRange (range: RangeNode): INodeCopy[] {
    const children = super.getContentInRange(range)
    return [{
      type: NodeType.CONTAINER_STYLE,
      size: children.reduce((p, c) => p + c.size, 0),
      props: { textStyle: this._textStyle, children }
    }]
  }

  getRepresentation (): NodeRepresentation {
    const representation: NodeRepresentation = super.getRepresentation()
    representation.addStyleInstruction(this._textStyle)
    return representation
  }

  deleteText (range: RangeNode, nodeUpdatesManager: NodeUpdatesManager): boolean {
    if (range.nodeInsideRange(this.getSize())) {
      nodeUpdatesManager.nodeDelete(this)
      nodeUpdatesManager.endPath()
      return true
    }

    return super.deleteText(range, nodeUpdatesManager)
  }
}

export { NodeContainerStyle }
