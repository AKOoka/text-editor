import { INode } from './INode'
import { TextStyleType } from '../../../common/TextStyleType'
import { BaseNodeContainer } from './BaseNodeContainer'
import { NodeText } from './NodeText'
import { BaseNode } from './BaseNode'
import { ChildNodeInRangeCallback } from './ChildNodeInRangeCallback'
import { NodeType } from './NodeType'
import { NodeRepresentation } from './NodeRepresentation'

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

  addText (text: string, offset: number, position: number): void {
    let startOffset: number = offset

    for (const childNode of this._childNodes) {
      if (this._nodeInRange(position, position, startOffset, childNode.getSize())) {
        childNode.addText(text, startOffset, position)
        this._size += text.length
        return
      }
      startOffset += childNode.getSize()
    }

    throw new Error("can't add text to node style container")
  }

  addTextStyle (offset: number, start: number, end: number, textStyle: TextStyleType): INode[] {
    if (textStyle === this._textStyle) {
      return [this]
    } else if (start <= offset && end >= offset + this.getSize()) {
      return [new NodeStyleContainer([this], textStyle)]
    }

    const childNodeInRange: ChildNodeInRangeCallback<TextStyleType> = (childNode, offset, start, end, textStyleType) => {
      return childNode.addTextStyle(offset, start, end, textStyleType)
    }
    this._childNodes = this._mergeNodes(
      this._updateChildNodesInRange<TextStyleType>(childNodeInRange, offset, start, end, textStyle)
    )

    return [this]
  }

  removeAllTextStyles (offset: number, start: number, end: number): INode[] {
    const childNodeInRange: ChildNodeInRangeCallback<null> = (childNode, offset, start, end) => {
      return childNode.removeAllTextStyles(offset, start, end)
    }
    this._childNodes = this._mergeNodes(
      this._updateChildNodesInRange<null>(childNodeInRange, offset, start, end, null)
    )

    if (start <= offset && end >= offset + this.getSize()) {
      return this._childNodes
    }
    return [this]
  }

  private _findLeftNodeIndexInRange (offset: number, start: number, end: number): number {
    let childStartOffset: number = offset

    for (let i = 0; i < this._childNodes.length; i++) {
      const childNodeSize: number = this._childNodes[i].getSize()

      if (this._nodeInRange(start, end, childStartOffset, childNodeSize)) {
        return i
      }

      childStartOffset += childNodeSize
    }

    throw new Error("couldn't find left node to split NodeStyleContainer")
  }

  private _findRightNodeIndexInRange (offset: number, start: number, end: number): number {
    let childStartOffset: number = offset + this.getSize()

    for (let i = this._childNodes.length - 1; i >= 0; i--) {
      const childNodeSize: number = this._childNodes[i].getSize()

      if (this._nodeInRange(start, end, childStartOffset, childNodeSize)) {
        return i
      }

      childStartOffset -= childNodeSize
    }

    throw new Error("couldn't find right node to split NodeStyleContainer")
  }

  removeConcreteTextStyle (offset: number, start: number, end: number, textStyle: TextStyleType): INode[] {
    if (textStyle === this._textStyle) {
      const endOfNode: number = offset + this.getSize()

      // temporary solution - NEED TO REFACTOR
      if ((start <= offset && end >= endOfNode)) {
        return this._childNodes
      } else if (start >= offset && end <= endOfNode) {
        const leftNodeIndexInRange: number = this._findLeftNodeIndexInRange(offset, start, end)
        const rightNodeIndexInRange: number = this._findRightNodeIndexInRange(offset, start, end)
        const rightNodeStyleContainer: INode = new NodeStyleContainer(
          this._childNodes.slice(rightNodeIndexInRange), this._textStyle
        )
        const nodesWithoutStyleContainer: INode[] = this._childNodes.slice(leftNodeIndexInRange, rightNodeIndexInRange)
        this._childNodes = this._childNodes.slice(0, leftNodeIndexInRange)
        return ([this] as INode[]).concat(nodesWithoutStyleContainer, rightNodeStyleContainer)
      } else if (start >= offset && start <= endOfNode) {
        const rightNodeIndexInRange: number = this._findRightNodeIndexInRange(offset, start, end)
        const nodesWithoutStyleContainer: INode[] = this._childNodes.slice(rightNodeIndexInRange)
        this._childNodes = this._childNodes.slice(0, rightNodeIndexInRange)
        return ([this] as INode[]).concat(nodesWithoutStyleContainer)
      } else if (end >= offset && end <= endOfNode) {
        const leftNodeIndexInRange: number = this._findLeftNodeIndexInRange(offset, start, end)
        const nodesWithoutStyleContainer: INode[] = this._childNodes.slice(0, leftNodeIndexInRange)
        this._childNodes = this._childNodes.slice(leftNodeIndexInRange)
        return nodesWithoutStyleContainer.concat([this])
      }

      return [this]
    }

    const childNodeInRange: ChildNodeInRangeCallback<TextStyleType> = (childNode, offset, start, end, textStyle) => {
      return childNode.removeConcreteTextStyle(offset, start, end, textStyle)
    }
    this._childNodes = this._mergeNodes(
      this._updateChildNodesInRange<TextStyleType>(childNodeInRange, offset, start, end, textStyle)
    )

    return [this]
  }

  textStylesInRange (offset: number, start: number, end: number): TextStyleType[] {
    let startOffset: number = offset

    if (this._nodeInRange(start, end, startOffset, this.getSize())) {
      let textStyles: TextStyleType[] = [this._textStyle]

      for (const childNode of this._childNodes) {
        textStyles = textStyles.concat(childNode.textStylesInRange(startOffset, start, end))
        startOffset += childNode.getSize()
      }

      return textStyles
    }

    return []
  }

  addContent (content: NodeRepresentation[], offset: number, x: number, parentTextStyles: TextStyleType[]): INode[] {
    let startOffset: number = offset
    for (let i = 0; i < this._childNodes.length; i++) {
      const childSize: number = this._childNodes[i].getSize()
      if (this._nodeInPosition(startOffset, x, this._childNodes[i].getSize())) {
        parentTextStyles.push(this._textStyle)
        this._childNodes.splice(i, 1, ...this._childNodes[i].addContent(content, startOffset, x, parentTextStyles))
        return [this]
      }
      startOffset += childSize
    }
    return [this]
  }

  getContentInRange (offset: number, startX: number, endX: number): NodeRepresentation {
    const content: NodeRepresentation = super.getContentInRange(offset, startX, endX)
    content.type = this._representation.type
    content.textStyle = this._textStyle
    return content
  }
}

export { NodeStyleContainer }
