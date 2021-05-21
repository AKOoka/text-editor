import { INode } from './INode'
import { NodeText } from './NodeText'
import { TextStyleType } from '../common/TextStyleType'
import { NodeStyleContainer } from './NodeStyleContainer'
import { BaseNodeContainer } from './BaseNodeContainer'
import { ChildNodeInRangeCase } from './ChildNodeInRangeCase'

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

  addTextStyle (offset: number, start: number, end: number, textStyleType: TextStyleType): Array<INode<HTMLElement>> {
    if (start <= offset && end >= offset + this.getSize()) {
      this._childNodes = [new NodeStyleContainer(this._childNodes, textStyleType)]
      return [this]
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

    return [this]
  }

  removeConcreteTextStyle (offset: number, start: number, end: number, textStyleType: TextStyleType): Array<INode<HTMLElement>> {
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
