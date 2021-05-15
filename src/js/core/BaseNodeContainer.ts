import { INode } from './INode'
import { TextStyleType } from '../common/TextStyleType'

abstract class BaseNodeContainer implements INode<HTMLElement> {
  protected _childNodes: Array<INode<HTMLElement>>

  constructor (childNodes: Array<INode<HTMLElement>>) {
    this._childNodes = childNodes
  }

  protected _nodeInRange (start: number, end: number, nodeOffset: number, nodeSize: number): boolean {
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

  removeText (offset: number, start: number, end: number = start + this.getSize()): boolean {
    const newChildNodes: Array<INode<HTMLElement>> = []
    let startOffset: number = offset

    for (const child of this._childNodes) {
      const curChildSize = child.getSize()

      if (this._nodeInRange(start, end, startOffset, curChildSize)) {
        const emptyChild: boolean = child.removeText(startOffset, start, end)
        if (!emptyChild) {
          newChildNodes.push(child)
        }
      }

      startOffset += curChildSize
    }

    this._childNodes = newChildNodes

    return this.getSize() === 0
  }

  abstract addText (text: string, offset: number, position: number): void
  abstract addTextStyle (textStyleType: TextStyleType, offset: number, start: number, end?: number): Array<INode<HTMLElement>>
  abstract removeAllTextStyles (offset: number, start: number, end?: number): Array<INode<HTMLElement>>
  abstract removeConcreteTextStyle (textStyleType: TextStyleType, offset: number, start: number, end?: number): Array<INode<HTMLElement>>
  abstract textStylesInRange (offset: number, start: number, end?: number): TextStyleType[]
  abstract render (): HTMLElement
}

export { BaseNodeContainer }
