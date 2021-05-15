import { INode } from './INode'
import { NodeText } from './NodeText'
import { TextStyleType } from '../common/TextStyleType'
import { NodeStyleContainer } from './NodeStyleContainer'
import { BaseNodeContainer } from './BaseNodeContainer'

class NodeLineContainer extends BaseNodeContainer {
  addText (text: string, offset: number, position: number): void {
    let startOffset: number = offset

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
    let childNodeSize: number = 0

    for (const child of this._childNodes) {
      childNodeSize = child.getSize()

      if (this._nodeInRange(start, end, startOffset, child.getSize())) {
        newChildNodes = newChildNodes.concat(child.addTextStyle(textStyleType, startOffset, start, end))
      } else {
        newChildNodes.push(child)
      }

      startOffset += childNodeSize
    }

    this._childNodes = newChildNodes
    return [this]
  }

  removeAllTextStyles (offset: number, start: number, end: number = start + this.getSize()): Array<INode<HTMLElement>> {
    let newChildNodes: Array<INode<HTMLElement>> = []
    let startOffset: number = offset

    for (const child of this._childNodes) {
      if (this._nodeInRange(start, end, startOffset, child.getSize())) {
        newChildNodes = newChildNodes.concat(child.removeAllTextStyles(startOffset, start, end))
      } else {
        newChildNodes.push(child)
      }

      startOffset += child.getSize()
    }

    this._childNodes = newChildNodes
    return [this]
  }

  removeConcreteTextStyle (textStyleType: TextStyleType, offset: number, start: number, end: number = start + this.getSize()): Array<INode<HTMLElement>> {
    let newChildNodes: Array<INode<HTMLElement>> = []
    let startOffset = offset

    for (const child of this._childNodes) {
      if (this._nodeInRange(start, end, startOffset, child.getSize())) {
        newChildNodes = newChildNodes.concat(child.removeConcreteTextStyle(textStyleType, startOffset, start, end))
      } else {
        newChildNodes.push(child)
      }

      startOffset += child.getSize()
    }

    this._childNodes = newChildNodes
    return [this]
  }

  textStylesInRange (offset: number, start: number, end: number = start + this.getSize()): TextStyleType[] {
    let startOffset: number = offset

    if (this._nodeInRange(start, end, startOffset, this.getSize())) {
      let textStyles: TextStyleType[] = []

      for (const node of this._childNodes) {
        textStyles = textStyles.concat(node.textStylesInRange(startOffset, start, end))
        startOffset += node.getSize()
      }

      return textStyles
    }

    return []
  }

  render (): HTMLElement {
    const container: HTMLElement = document.createElement('div')
    container.classList.add('text-line')

    for (const child of this._childNodes) {
      container.append(child.render())
    }

    return container
  }
}

export { NodeLineContainer }
