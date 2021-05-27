import { INode } from './INode'
import { TextStyleType } from '../../../common/TextStyleType'
import { BaseNodeContainer } from './BaseNodeContainer'
import { NodeText } from './NodeText'
import { BaseNode } from './BaseNode'
import { ChildNodeInRangeCallback } from './ChildNodeInRangeCallback'
import { NodeType } from './NodeType'
import { NodeRepresentation } from '../NodeRepresentation'
import { PositionNode } from './PositionNode'
import { RangeNode } from './RangeNode'

class NodeStyleContainer extends BaseNodeContainer {
  private readonly _textStyle: TextStyleType

  constructor (childNodes: INode[], textStyle: TextStyleType) {
    super(childNodes)
    this._textStyle = textStyle
    this._representation.type = NodeType.CONTAINER_STYLE
    this._representation.textStyle = textStyle
  }

  mergeWithNode (node: INode, joinAfter: boolean): INode[] {
    if (node.getStyle() !== this.getStyle()) {
      if (joinAfter) {
        return [this, node]
      }
      return [node, this]
    }

    this._size += node.getSize()
    if (node instanceof BaseNodeContainer) {
      if (joinAfter) {
        this._childNodes = this._childNodes.concat(node.getChildNodes())
      } else {
        this._childNodes = node.getChildNodes().concat(this._childNodes)
      }
    } else if (node instanceof BaseNode) {
      if (joinAfter) {
        this._childNodes.push(new NodeText(node.getText()))
      } else {
        this._childNodes.unshift(new NodeText(node.getText()))
      }
    }
    return [this]
  }

  getStyle (): TextStyleType | null {
    return this._textStyle
  }

  addText (position: PositionNode, text: string): void {
    let startOffset: number = position.offset

    for (const childNode of this._childNodes) {
      if (position.childNodeInPosition(startOffset, childNode.getSize())) {
        childNode.addText(new PositionNode(startOffset, position.initPosition), text)
        this._size += text.length
        return
      }
      startOffset += childNode.getSize()
    }

    throw new Error("can't add text to node style container")
  }

  addTextStyle (range: RangeNode, textStyle: TextStyleType): INode[] {
    if (textStyle === this._textStyle) {
      return [this]
    } else if (range.nodeInsideRange(this.getSize())) {
      return [new NodeStyleContainer([this], textStyle)]
    }

    const childNodeInRange: ChildNodeInRangeCallback<TextStyleType> =
      (range, childNode, textStyleType) => childNode.addTextStyle(range, textStyleType)
    this._childNodes = this._mergeNodes(
      this._updateChildNodesInRange<TextStyleType>(childNodeInRange, range, textStyle)
    )

    return [this]
  }

  deleteAllTextStyles (range: RangeNode): INode[] {
    const childNodeInRange: ChildNodeInRangeCallback<null> =
      (range, childNode) => childNode.deleteAllTextStyles(range)
    this._childNodes = this._mergeNodes(
      this._updateChildNodesInRange<null>(childNodeInRange, range, null)
    )

    if (range.nodeInsideRange(this.getSize())) {
      return this._childNodes
    }
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

  deleteConcreteTextStyle (range: RangeNode, textStyle: TextStyleType): INode[] {
    if (textStyle === this._textStyle) {
      // temporary solution - NEED TO REFACTOR
      if (range.nodeInsideRange(this.getSize())) {
        return this._childNodes
      } else if (range.rangeInsideNode(this.getSize())) {
        const leftNodeIndexInRange: number = this._findLeftNodeIndexInRange(range)
        const rightNodeIndexInRange: number = this._findRightNodeIndexInRange(range)
        const rightNodeStyleContainer: INode = new NodeStyleContainer(
          this._childNodes.slice(rightNodeIndexInRange), this._textStyle
        )
        const nodesWithoutStyleContainer: INode[] = this._childNodes.slice(leftNodeIndexInRange, rightNodeIndexInRange)
        this._childNodes = this._childNodes.slice(0, leftNodeIndexInRange)
        return ([this] as INode[]).concat(nodesWithoutStyleContainer, rightNodeStyleContainer)
      } else if (range.nodeStartInRange(this.getSize())) {
        const rightNodeIndexInRange: number = this._findRightNodeIndexInRange(range)
        const nodesWithoutStyleContainer: INode[] = this._childNodes.slice(rightNodeIndexInRange)
        this._childNodes = this._childNodes.slice(0, rightNodeIndexInRange)
        return ([this] as INode[]).concat(nodesWithoutStyleContainer)
      } else if (range.nodeEndInRange(this.getSize())) {
        const leftNodeIndexInRange: number = this._findLeftNodeIndexInRange(range)
        const nodesWithoutStyleContainer: INode[] = this._childNodes.slice(0, leftNodeIndexInRange)
        this._childNodes = this._childNodes.slice(leftNodeIndexInRange)
        return nodesWithoutStyleContainer.concat([this])
      }

      return [this]
    }

    const childNodeInRange: ChildNodeInRangeCallback<TextStyleType> =
      (range, childNode, textStyle) => childNode.deleteConcreteTextStyle(range, textStyle)
    this._childNodes = this._mergeNodes(
      this._updateChildNodesInRange<TextStyleType>(childNodeInRange, range, textStyle)
    )

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

  addContent (position: PositionNode, content: NodeRepresentation[], parentTextStyles: TextStyleType[]): INode[] {
    let startOffset: number = position.offset
    for (let i = 0; i < this._childNodes.length; i++) {
      const childSize: number = this._childNodes[i].getSize()
      if (position.nodeInPosition(startOffset, this._childNodes[i].getSize())) {
        parentTextStyles.push(this._textStyle)
        this._childNodes.splice(i, 1, ...this._childNodes[i].addContent(new PositionNode(startOffset, position.initPosition), content, parentTextStyles))
        return [this]
      }
      startOffset += childSize
    }
    return [this]
  }

  getContentInRange (range: RangeNode): NodeRepresentation {
    const content: NodeRepresentation = super.getContentInRange(range)
    content.type = this._representation.type
    content.textStyle = this._textStyle
    return content
  }
}

export { NodeStyleContainer }
