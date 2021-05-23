import { INode } from './INode'
import { TextStyleType } from '../../../common/TextStyleType'
import { ChildNodeInRangeCallback } from './ChildNodeInRangeCallback'
import { NodeRepresentation } from './NodeRepresentation'

abstract class BaseNodeContainer implements INode {
  protected _childNodes: INode[]
  protected _size: number
  protected _representation: NodeRepresentation

  protected constructor (childNodes: INode[]) {
    this._childNodes = childNodes
    this._size = 0
    this._representation = new NodeRepresentation()

    for (const childNode of this._childNodes) {
      this._size += childNode.getSize()
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

  protected _mergeNodes (nodes: INode[]): INode[] {
    if (nodes.length <= 1) {
      return nodes
    }

    // const mergedNodes: INode[] = [nodes[0]]

    // for (let i = 1; i < nodes.length - 1; i++) {
    //   const mergeResult: INode[] = mergedNodes[mergedNodes.length - 1].mergeWithNode(nodes[i], true)
    //   mergedNodes.push(mergeResult[mergeResult.length === 2 ? 1 : 0])
    // }

    const mergedNodes: INode[] = [nodes[0]]
    let mergeIndex: number = 0

    for (let i = 1; i < nodes.length; i++) {
      const mergeResult: INode[] = mergedNodes[mergeIndex].mergeWithNode(nodes[i], true)

      if (mergeResult.length === 1) {
        continue
      }

      mergedNodes.push(mergeResult[1])
      mergeIndex++
    }

    return mergedNodes
  }

  protected _updateChildNodesInRange<TextStyle> (
    inRange: ChildNodeInRangeCallback<TextStyle>,
    offset: number,
    start: number,
    end: number,
    textStyleType: TextStyle
  ): INode[] {
    let childNodesInRange: INode[] = []
    let childStartOffset: number = offset

    for (const childNode of this._childNodes) {
      const childNodeSize: number = childNode.getSize()

      if (this._nodeInRange(start, end, childStartOffset, childNodeSize)) {
        childNodesInRange = childNodesInRange.concat(inRange(childNode, childStartOffset, start, end, textStyleType))
      } else {
        childNodesInRange.push(childNode)
      }

      childStartOffset += childNodeSize
    }

    return childNodesInRange
  }

  getChildNodes (): INode[] {
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

  removeText (offset: number, start: number, end: number): boolean {
    const newChildNodes: INode[] = []
    let startOffset: number = offset

    for (const childNode of this._childNodes) {
      const curChildSize = childNode.getSize()

      if (this._nodeInRange(start, end, startOffset, curChildSize)) {
        const childSizeBefore: number = childNode.getSize()
        const emptyChild: boolean = childNode.removeText(startOffset, start, end)
        this._size -= childSizeBefore - childNode.getSize()
        if (!emptyChild) {
          newChildNodes.push(childNode)
        }
      } else {
        newChildNodes.push(childNode)
      }

      startOffset += curChildSize
    }

    // this._childNodes = newChildNodes
    this._childNodes = this._mergeNodes(newChildNodes)

    return this._size === 0
  }

  abstract mergeWithNode (node: INode, joinAfter: boolean): INode[]
  abstract getStyle (): TextStyleType | null
  abstract addText (text: string, offset: number, position: number): void
  abstract addTextStyle (offset: number, start: number, end: number, textStyleType: TextStyleType): INode[]
  abstract removeAllTextStyles (offset: number, start: number, end: number): INode[]
  abstract removeConcreteTextStyle (offset: number, start: number, end: number, textStyleType: TextStyleType): INode[]
  abstract textStylesInRange (offset: number, start: number, end: number): TextStyleType[]
  abstract getRepresentation (): NodeRepresentation
}

export { BaseNodeContainer }
