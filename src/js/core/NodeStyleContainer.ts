import { INode } from './INode'
import { TextStyleType } from '../common/TextStyleType'
import { BaseNodeContainer } from './BaseNodeContainer'
import { NodeText } from './NodeText'
import { BaseNode } from './BaseNode'
import { ChildNodeInRangeCase } from './ChildNodeInRangeCase'

class NodeStyleContainer extends BaseNodeContainer {
  private readonly _textStyleType: TextStyleType

  constructor (childNodes: Array<INode<HTMLElement>>, textStyleType: TextStyleType) {
    super(childNodes)
    this._textStyleType = textStyleType
  }

  mergeWithNode (node: INode<HTMLElement>, joinAfter: boolean): Array<INode<HTMLElement>> {
    if (node.getStyleType() !== this.getStyleType()) {
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

  getStyleType (): TextStyleType | null {
    return this._textStyleType
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

  addTextStyle (offset: number, start: number, end: number, textStyleType: TextStyleType): Array<INode<HTMLElement>> {
    if (textStyleType === this._textStyleType) {
      return [this]
    } else if (start <= offset && end >= offset + this.getSize()) {
      return [new NodeStyleContainer([this], textStyleType)]
    }

    const childNodeInRange: ChildNodeInRangeCase<TextStyleType> = (childNode, offset, start, end, textStyleType) => {
      return childNode.addTextStyle(offset, start, end, textStyleType)
    }
    this._childNodes = this._mergeNodes(
      this._updateChildNodesInRange<TextStyleType>(childNodeInRange, offset, start, end, textStyleType)
    )

    return [this]
  }

  removeAllTextStyles (offset: number, start: number, end: number): Array<INode<HTMLElement>> {
    const childNodeInRange: ChildNodeInRangeCase<null> = (childNode, offset, start, end) => {
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

  removeConcreteTextStyle (offset: number, start: number, end: number, textStyleType: TextStyleType): Array<INode<HTMLElement>> {
    if (textStyleType === this._textStyleType) {
      const endOfNode: number = offset + this.getSize()

      // temporary solution - NEED TO REFACTOR
      if ((start <= offset && end >= endOfNode)) {
        return this._childNodes
      } else if (start >= offset && end <= endOfNode) {
        const leftNodeIndexInRange: number = this._findLeftNodeIndexInRange(offset, start, end)
        const rightNodeIndexInRange: number = this._findRightNodeIndexInRange(offset, start, end)
        const rightNodeStyleContainer: INode<HTMLElement> = new NodeStyleContainer(
          this._childNodes.slice(rightNodeIndexInRange), this._textStyleType
        )
        const nodesWithoutStyleContainer: Array<INode<HTMLElement>> = this._childNodes.slice(leftNodeIndexInRange, rightNodeIndexInRange)
        this._childNodes = this._childNodes.slice(0, leftNodeIndexInRange)
        return ([this] as Array<INode<HTMLElement>>).concat(nodesWithoutStyleContainer, rightNodeStyleContainer)
      } else if (start >= offset && start <= endOfNode) {
        const rightNodeIndexInRange: number = this._findRightNodeIndexInRange(offset, start, end)
        const nodesWithoutStyleContainer: Array<INode<HTMLElement>> = this._childNodes.slice(rightNodeIndexInRange)
        this._childNodes = this._childNodes.slice(0, rightNodeIndexInRange)
        return ([this] as Array<INode<HTMLElement>>).concat(nodesWithoutStyleContainer)
      } else if (end >= offset && end <= endOfNode) {
        const leftNodeIndexInRange: number = this._findLeftNodeIndexInRange(offset, start, end)
        const nodesWithoutStyleContainer: Array<INode<HTMLElement>> = this._childNodes.slice(0, leftNodeIndexInRange)
        this._childNodes = this._childNodes.slice(leftNodeIndexInRange)
        return nodesWithoutStyleContainer.concat([this])
      }

      return [this]
    }

    const childNodeInRange: ChildNodeInRangeCase<TextStyleType> = (childNode, offset, start, end, textStyleType) => {
      return childNode.removeConcreteTextStyle(offset, start, end, textStyleType)
    }
    this._childNodes = this._mergeNodes(
      this._updateChildNodesInRange<TextStyleType>(childNodeInRange, offset, start, end, textStyleType)
    )

    return [this]
  }

  textStylesInRange (offset: number, start: number, end: number): TextStyleType[] {
    let startOffset: number = offset

    if (this._nodeInRange(start, end, startOffset, this.getSize())) {
      let textStyles: TextStyleType[] = [this._textStyleType]

      for (const childNode of this._childNodes) {
        textStyles = textStyles.concat(childNode.textStylesInRange(startOffset, start, end))
        startOffset += childNode.getSize()
      }

      return textStyles
    }

    return []
  }

  render (): HTMLElement {
    const container: HTMLElement = document.createElement('span')
    container.classList.add(`${this._textStyleType}-text`)

    for (const childNode of this._childNodes) {
      container.append(childNode.render())
    }

    return container
  }
}

export { NodeStyleContainer }
