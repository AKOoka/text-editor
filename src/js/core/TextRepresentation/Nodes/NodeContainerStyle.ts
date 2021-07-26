import { CreatedContent, INode, INodeCopy, NodeType } from './INode'
import { BaseNodeContainer, ChildNodeInRangeCallback } from './BaseNodeContainer'
import { NodeRepresentation, NodeRepresentationType } from './NodeRepresentation'
import { PositionWithOffset } from '../../../common/PositionWithOffset'
import { RangeWithOffset } from '../../../common/RangeWithOffset'
import { TextStyle } from '../../../common/TextStyle'

class NodeContainerStyle extends BaseNodeContainer {
  private readonly _textStyle: TextStyle

  constructor (childNodes: INode[], textStyle: TextStyle) {
    super(childNodes)
    this._textStyle = textStyle
    this._representation.representationType = NodeRepresentationType.TEXT
  }

  getStyle (): TextStyle {
    return this._textStyle
  }

  getNodeType (): NodeType {
    return NodeType.CONTAINER_STYLE
  }

  addTextStyle (range: RangeWithOffset, textStyle: TextStyle): INode[] {
    if (this._textStyle.compare(textStyle)) {
      return [this]
    } else if (range.isNodeInsideRange(this.getSize())) {
      const newNode = new NodeContainerStyle([this], textStyle)
      return [newNode]
    }

    const childNodeInRange: ChildNodeInRangeCallback<TextStyle> =
      (range, childNode, textStyleType) => childNode.addTextStyle(range, textStyleType)
    this._childNodes = this._updateChildNodesInRange<TextStyle>(childNodeInRange, range, textStyle)

    return [this]
  }

  deleteTextStyleAll (range: RangeWithOffset): INode[] {
    if (range.isNodeInsideRange(this.getSize())) {
      const newNode = this._nodeMerger.mergeNodesToNodeText(this._childNodes)
      return [newNode]
    }

    const childNodeInRange: ChildNodeInRangeCallback<null> =
      (range, childNode) => childNode.deleteTextStyleAll(range)
    this._childNodes = this._updateChildNodesInRange<null>(childNodeInRange, range, null)

    return [this]
  }

  private _findLeftNodeIndexInRange (range: RangeWithOffset): number {
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

  private _findRightNodeIndexInRange (range: RangeWithOffset): number {
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

  deleteTextStyleConcrete (range: RangeWithOffset, textStyle: TextStyle): INode[] {
    if (this._textStyle.compare(textStyle)) {
      // temporary solution - NEED TO REFACTOR
      let newNodes: INode[] = []

      if (range.isNodeInsideRange(this.getSize())) {
        newNodes = this._childNodes
      } else if (range.isRangeInsideNode(this.getSize())) {
        const leftNodeIndexInRange: number = this._findLeftNodeIndexInRange(range)
        const rightNodeIndexInRange: number = this._findRightNodeIndexInRange(range)
        const rightNodeStyleContainer: INode = new NodeContainerStyle(
          this._childNodes.slice(rightNodeIndexInRange), this._textStyle
        )
        const nodesWithoutStyleContainer: INode[] = this._childNodes.slice(leftNodeIndexInRange, rightNodeIndexInRange)
        this._childNodes = this._childNodes.slice(0, leftNodeIndexInRange)
        newNodes = ([this] as INode[]).concat(nodesWithoutStyleContainer, rightNodeStyleContainer)
      } else if (range.isNodeStartInRange(this.getSize())) {
        const rightNodeIndexInRange: number = this._findRightNodeIndexInRange(range)
        const nodesWithoutStyleContainer: INode[] = this._childNodes.slice(rightNodeIndexInRange)
        this._childNodes = this._childNodes.slice(0, rightNodeIndexInRange)
        newNodes = ([this] as INode[]).concat(nodesWithoutStyleContainer)
      } else if (range.isNodeEndInRange(this.getSize())) {
        const leftNodeIndexInRange: number = this._findLeftNodeIndexInRange(range)
        const nodesWithoutStyleContainer: INode[] = this._childNodes.slice(0, leftNodeIndexInRange)
        this._childNodes = this._childNodes.slice(leftNodeIndexInRange)
        newNodes = nodesWithoutStyleContainer.concat([this])
      }

      return newNodes
    }

    const childNodeInRange: ChildNodeInRangeCallback<TextStyle> =
      (range, childNode, textStyle) => childNode.deleteTextStyleConcrete(range, textStyle)
    this._childNodes = this._updateChildNodesInRange<TextStyle>(childNodeInRange, range, textStyle)

    return [this]
  }

  getTextStylesInRange (range: RangeWithOffset): TextStyle[] {
    let startOffset: number = range.offset

    if (range.childNodeInRange(startOffset, this.getSize())) {
      let textStyles: TextStyle[] = [this._textStyle]

      for (const childNode of this._childNodes) {
        textStyles = textStyles.concat(childNode.getTextStylesInRange(new RangeWithOffset(range.start, range.end, startOffset)))
        startOffset += childNode.getSize()
      }

      return textStyles
    }

    return []
  }

  addContent (position: PositionWithOffset, content: INodeCopy[], parentTextStyles: TextStyle[]): CreatedContent {
    parentTextStyles.push(this._textStyle)
    const { nodes, nodeStyles } = super.addContent(position, content, parentTextStyles)
    for (const style of nodeStyles) {
      this._childStyles.add(style)
    }
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

  getContentInRange (range: RangeWithOffset): INodeCopy[] {
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

  deleteText (range: RangeWithOffset): boolean {
    if (range.isNodeInsideRange(this.getSize())) {
      return true
    }

    return super.deleteText(range)
  }
}

export { NodeContainerStyle }
