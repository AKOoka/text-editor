import { INode } from './INode'
import { TextStyleType } from '../common/TextStyleType'
import { BaseNodeContainer } from './BaseNodeContainer'
import { NodeText } from './NodeText'
import { BaseNode } from './BaseNode'

class NodeStyleContainer extends BaseNodeContainer {
  private readonly _textStyleType: TextStyleType

  constructor (textStyleType: TextStyleType, childNodes: Array<INode<HTMLElement>>) {
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

    // this._childNodes.push(new NodeText(text))
    throw new Error("can't add text to node style container")
  }

  addTextStyle (textStyleType: TextStyleType, offset: number, start: number, end: number = start + this.getSize()): Array<INode<HTMLElement>> {
    if (textStyleType === this._textStyleType) {
      return [this]
    } else if (start <= offset && end >= offset + this.getSize()) {
      return [new NodeStyleContainer(textStyleType, [this])]
    }

    let newChildNodes: Array<INode<HTMLElement>> = []
    let startOffset: number = offset

    for (const childNode of this._childNodes) {
      const childNodeSize: number = childNode.getSize()
      if (this._nodeInRange(start, end, startOffset, childNode.getSize())) {
        newChildNodes = newChildNodes.concat(childNode.addTextStyle(textStyleType, startOffset, start, end))
      } else {
        newChildNodes.push(childNode)
      }

      startOffset += childNodeSize
    }

    // this._childNodes = newChildNodes
    this._childNodes = this.mergeNodes(newChildNodes)

    return [this]
  }

  removeAllTextStyles (offset: number, start: number, end: number = start + this.getSize()): Array<INode<HTMLElement>> {
    let newChildNodes: Array<INode<HTMLElement>> = []
    let startOffset: number = offset

    for (const childNode of this._childNodes) {
      const childNodeSize: number = childNode.getSize()

      if (this._nodeInRange(start, end, startOffset, childNode.getSize())) {
        newChildNodes = newChildNodes.concat(childNode.removeAllTextStyles(startOffset, start, end))
      } else {
        newChildNodes.push(childNode)
      }

      startOffset += childNodeSize
    }

    // this._childNodes = newChildNodes
    this._childNodes = this.mergeNodes(newChildNodes)

    if (start <= offset && end >= offset + this.getSize()) {
      return this._childNodes
    }
    return [this]
  }

  removeConcreteTextStyle (textStyleType: TextStyleType, offset: number, start: number, end: number = start + this.getSize()): Array<INode<HTMLElement>> {
    // it doesn't work when concrete style is same as container's style but need to remove only part of style container
    if (textStyleType === this._textStyleType && (start <= offset && end >= offset + this.getSize())) {
      return this._childNodes
    }

    let newChildNodes: Array<INode<HTMLElement>> = []
    let startOffset = offset

    for (const childNode of this._childNodes) {
      const childNodeSize: number = childNode.getSize()

      if (this._nodeInRange(start, end, startOffset, childNode.getSize())) {
        newChildNodes = newChildNodes.concat(childNode.removeConcreteTextStyle(textStyleType, startOffset, start, end))
      } else {
        newChildNodes.push(childNode)
      }

      startOffset += childNodeSize
    }

    // this._childNodes = newChildNodes
    this._childNodes = this.mergeNodes(this._childNodes)

    return [this]
  }

  textStylesInRange (offset: number, start: number, end: number = start + this.getSize()): TextStyleType[] {
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
