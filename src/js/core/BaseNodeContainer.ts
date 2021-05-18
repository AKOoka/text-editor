import { INode } from './INode'
import { TextStyleType } from '../common/TextStyleType'

abstract class BaseNodeContainer implements INode<HTMLElement> {
  protected _childNodes: Array<INode<HTMLElement>>
  protected _size: number

  constructor (childNodes: Array<INode<HTMLElement>>) {
    this._childNodes = childNodes
    this._size = 0

    for (const child of this._childNodes) {
      this._size += child.getSize()
    }
  }

  protected _nodeInPosition (position: number, nodeOffset: number, nodeSize: number): boolean {
    return (position >= nodeOffset && position <= nodeOffset + nodeSize)
  }

  protected _nodeInRange (start: number, end: number, nodeOffset: number, nodeSize: number): boolean {
    const rightEdge: number = nodeOffset + nodeSize

    return (((start >= nodeOffset && start <= rightEdge) && !(start === rightEdge && end >= rightEdge)) ||
           ((end >= nodeOffset && end <= rightEdge) && !(end === nodeOffset && start <= nodeOffset)))
  }

  protected mergeNodes (nodes: Array<INode<HTMLElement>>): Array<INode<HTMLElement>> {
    let mergedNodes: Array<INode<HTMLElement>> = []

    for (let i = 0; i < nodes.length - 1; i++) {
      mergedNodes = mergedNodes.concat(nodes[i].mergeWithNode(nodes[i + 1], true))
    }

    return mergedNodes
  }

  getChildNodes (): Array<INode<HTMLElement>> {
    return this._childNodes
  }

  getSize (): number {
    // let size: number = 0
    // for (const child of this._childNodes) {
    //   size += child.getSize()
    // }
    // return size
    return this._size
  }

  removeText (offset: number, start: number, end: number = start + this.getSize()): boolean {
    const newChildNodes: Array<INode<HTMLElement>> = []
    let startOffset: number = offset

    for (const childNode of this._childNodes) {
      const curChildSize = childNode.getSize()

      if (this._nodeInRange(start, end, startOffset, curChildSize)) {
        const childSizeBefore: number = childNode.getSize()
        const emptyChild: boolean = childNode.removeText(startOffset, start, end)
        this._size += childNode.getSize() - childSizeBefore
        if (!emptyChild) {
          newChildNodes.push(childNode)
        }
      } else {
        newChildNodes.push(childNode)
      }

      startOffset += curChildSize
    }

    // this._childNodes = newChildNodes
    this._childNodes = this.mergeNodes(newChildNodes)

    return this._size === 0
  }

  abstract mergeWithNode (node: INode<HTMLElement>, joinAfter: boolean): Array<INode<HTMLElement>>
  abstract getStyleType (): TextStyleType | null
  abstract addText (text: string, offset: number, position: number): void
  abstract addTextStyle (textStyleType: TextStyleType, offset: number, start: number, end?: number): Array<INode<HTMLElement>>
  abstract removeAllTextStyles (offset: number, start: number, end?: number): Array<INode<HTMLElement>>
  abstract removeConcreteTextStyle (textStyleType: TextStyleType, offset: number, start: number, end?: number): Array<INode<HTMLElement>>
  abstract textStylesInRange (offset: number, start: number, end?: number): TextStyleType[]
  abstract render (): HTMLElement
}

export { BaseNodeContainer }
