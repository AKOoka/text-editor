import { INode } from './INode'
import { TextStyleType } from '../common/TextStyleType'
import { NodeText } from './NodeText'

class NodeStyleContainer implements INode<HTMLElement> {
  private _childNodes: Array<INode<HTMLElement>>
  private readonly _textStyleType: TextStyleType

  constructor (textStyleType: TextStyleType, childNodes: Array<INode<HTMLElement>>) {
    this._childNodes = childNodes
    this._textStyleType = textStyleType
  }

  getSize (): number {
    let size: number = 0
    for (const child of this._childNodes) {
      size += child.getSize()
    }
    return size
  }

  private _nodeInRange (start: number, end: number, nodeOffset: number, nodeSize: number): boolean {
    return (start >= nodeOffset && start <= nodeOffset + nodeSize) ||
           (end >= nodeOffset && end <= nodeOffset + nodeSize)
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

    this._childNodes.push(new NodeText(text))
  }

  removeText (offset: number, start: number, end: number = start + this.getSize()): boolean {
    const newChildNodes: Array<INode<HTMLElement>> = []
    let startOffset: number = offset

    for (const child of this._childNodes) {
      if (this._nodeInRange(start, end, startOffset, child.getSize())) {
        const emptyChild: boolean = child.removeText(startOffset, start, end)
        if (!emptyChild) {
          newChildNodes.push(child)
        }
      }

      startOffset += child.getSize()
    }

    this._childNodes = newChildNodes

    return this.getSize() === 0
  }

  addTextStyle (textStyleType: TextStyleType, offset: number, start: number, end: number = start + this.getSize()): Array<INode<HTMLElement>> {
    if (textStyleType === this._textStyleType) {
      return [this]
    } else if (start <= offset && end >= offset + this.getSize()) {
      return [new NodeStyleContainer(textStyleType, [this])]
    }

    let newChildNodes: Array<INode<HTMLElement>> = []
    let startOffset: number = offset

    for (const child of this._childNodes) {
      if (this._nodeInRange(start, end, startOffset, child.getSize())) {
        newChildNodes = newChildNodes.concat(child.addTextStyle(textStyleType, startOffset, start, end))
      } else {
        newChildNodes.push(child)
      }

      startOffset += child.getSize()
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
