import { INode } from './INode'
import { TextStyleType } from '../common/TextStyleType'
import { BaseNodeContainer } from './BaseNodeContainer'

class NodeStyleContainer extends BaseNodeContainer {
  private readonly _textStyleType: TextStyleType

  constructor (textStyleType: TextStyleType, childNodes: Array<INode<HTMLElement>>) {
    super(childNodes)
    this._textStyleType = textStyleType
  }

  addText (text: string, offset: number, position: number): void {
    let startOffset: number = offset

    for (const child of this._childNodes) {
      if (this._nodeInRange(position, position, startOffset, child.getSize())) {
        child.addText(text, startOffset, position)
        return
      }
      startOffset += child.getSize()
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
    let childNodeSize = 0

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

    if (start <= offset && end >= offset + this.getSize()) {
      return this._childNodes
    }
    return [this]
  }

  removeConcreteTextStyle (textStyleType: TextStyleType, offset: number, start: number, end: number = start + this.getSize()): Array<INode<HTMLElement>> {
    if (textStyleType === this._textStyleType && (start <= offset && end >= offset + this.getSize())) {
      return this._childNodes
    }

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
      let textStyles: TextStyleType[] = [this._textStyleType]

      for (const node of this._childNodes) {
        textStyles = textStyles.concat(node.textStylesInRange(startOffset, start, end))
        startOffset += node.getSize()
      }

      return textStyles
    }

    return []
  }

  render (): HTMLElement {
    const container: HTMLElement = document.createElement('span')
    container.classList.add(`${this._textStyleType}-text`)

    for (const child of this._childNodes) {
      container.append(child.render())
    }

    return container
  }
}

export { NodeStyleContainer }
