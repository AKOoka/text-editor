import { INode } from './INode'
import { NodeText } from './NodeText'
import { TextStyleType } from '../common/TextStyleType'
import { NodeStyleContainer } from './NodeStyleContainer'

// maybe make abstract classes for Node(StyleContainer/Container) and Node(Text/TextStyle)
// add functionality to merge similar adjacent nodes
class NodeContainer implements INode<HTMLElement> {
  private _childNodes: Array<INode<HTMLElement>>

  constructor (childNodes: Array<INode<HTMLElement>>) {
    this._childNodes = childNodes
  }

  private _nodeInRange (start: number, end: number, nodeOffset: number, nodeSize: number): boolean {
    return (start >= nodeOffset && start <= nodeOffset + nodeSize) ||
      (end >= nodeOffset && end <= nodeOffset + nodeSize)
  }

  getSize (): number {
    let size: number = 0
    for (const child of this._childNodes) {
      size += child.getSize()
    }
    return size
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
    if (start <= offset && end >= offset + this.getSize()) {
      this._childNodes = [new NodeStyleContainer(textStyleType, this._childNodes)]
      return [this]
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

export { NodeContainer }
