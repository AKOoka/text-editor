import { INode } from './INode'
import { NodeText } from './NodeText'
import { TextStyleType } from '../common/TextStyleType'
import { NodeStyleContainer } from './NodeStyleContainer'
import { BaseNodeContainer } from './BaseNodeContainer'

class NodeLineContainer extends BaseNodeContainer {
  getStyleType (): TextStyleType | null {
    return null
  }

  mergeWithNode (): Array<INode<HTMLElement>> {
    throw new Error("Node Line Container can't be joined to another node because it must always be single on the top of hierarchy")
  }

  // for addText when it is only for textCursor i need to go from end to start and computing startOffset = size - child.size
  addText (text: string, offset: number, position: number): void {
    let startOffset: number = offset
    this._size += text.length

    for (const child of this._childNodes) {
      if (this._nodeInRange(position, position, startOffset, child.getSize())) {
        child.addText(text, startOffset, position)
        return
      }
      startOffset += child.getSize()
    }

    this._childNodes.push(new NodeText(text))
  }

  addTextStyle (textStyleType: TextStyleType, offset: number, start: number, end: number = start + this.getSize()): Array<INode<HTMLElement>> {
    if (start <= offset && end >= offset + this.getSize()) {
      this._childNodes = [new NodeStyleContainer(textStyleType, this._childNodes)]
      return [this]
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
    return [this]
  }

  removeConcreteTextStyle (textStyleType: TextStyleType, offset: number, start: number, end: number = start + this.getSize()): Array<INode<HTMLElement>> {
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
    this._childNodes = this.mergeNodes(newChildNodes)
    return [this]
  }

  textStylesInRange (offset: number, start: number, end: number = start + this.getSize()): TextStyleType[] {
    let startOffset: number = offset

    if (this._nodeInRange(start, end, startOffset, this.getSize())) {
      let textStyles: TextStyleType[] = []

      for (const childNode of this._childNodes) {
        textStyles = textStyles.concat(childNode.textStylesInRange(startOffset, start, end))
        startOffset += childNode.getSize()
      }

      return textStyles
    }

    return []
  }

  render (): HTMLElement {
    const container: HTMLElement = document.createElement('div')
    container.classList.add('text-line')

    for (const childNode of this._childNodes) {
      container.append(childNode.render())
    }

    return container
  }
}

export { NodeLineContainer }
