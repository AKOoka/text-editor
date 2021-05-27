import { INode } from './INode'
import { TextStyleType } from '../../../common/TextStyleType'
import { ChildNodeInRangeCallback } from './ChildNodeInRangeCallback'
import { NodeRepresentation } from '../NodeRepresentation'
import { RangeNode } from './RangeNode'
import { PositionNode } from './PositionNode'

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

  protected _mergeNodes (nodes: INode[]): INode[] {
    // make like .addContent() but with NodeType instead of TextStyleType
    if (nodes.length <= 1) {
      return nodes
    }

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
    inRangeCallback: ChildNodeInRangeCallback<TextStyle>,
    rangeNode: RangeNode,
    textStyleType: TextStyle
  ): INode[] {
    let childNodesInRange: INode[] = []
    let childStartOffset: number = rangeNode.offset

    for (const childNode of this._childNodes) {
      const childNodeSize: number = childNode.getSize()

      if (rangeNode.childNodeInRange(childStartOffset, childNodeSize)) {
        childNodesInRange = childNodesInRange.concat(inRangeCallback(new RangeNode(childStartOffset, rangeNode.initStart, rangeNode.initEnd), childNode, textStyleType))
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
    return this._size
  }

  deleteText (range: RangeNode): boolean {
    const newChildNodes: INode[] = []
    let startOffset: number = range.offset

    for (const childNode of this._childNodes) {
      const curChildSize = childNode.getSize()

      if (range.childNodeInRange(startOffset, curChildSize)) {
        const childSizeBefore: number = childNode.getSize()
        const emptyChild: boolean = childNode.deleteText(new RangeNode(startOffset, range.initStart, range.initEnd))
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

  getContentInRange (range: RangeNode): NodeRepresentation {
    const content: NodeRepresentation = new NodeRepresentation()
    content.children = []
    content.size = 0
    let nodeOffset: number = range.offset
    for (const childNode of this._childNodes) {
      if (range.childNodeInRange(range.start, range.end)) {
        const childContent = childNode.getContentInRange(new RangeNode(nodeOffset, range.initStart, range.initEnd))
        content.children.push(childContent)
        content.size += childContent.size
      }
      nodeOffset += childNode.getSize()
    }
    return content
  }

  getRepresentation (): NodeRepresentation {
    this._representation.children = []
    this._representation.size = 0
    for (const childNode of this._childNodes) {
      const childRepresentation = childNode.getRepresentation()
      this._representation.children.push(childRepresentation)
      this._representation.size += childRepresentation.size
    }
    return this._representation
  }

  abstract getStyle (): TextStyleType | null
  abstract getTextStylesInRange (range: RangeNode): TextStyleType[]
  abstract addText (position: PositionNode, text: string): void
  abstract addContent (position: PositionNode, content: NodeRepresentation[], parentTextStyles: TextStyleType[]): INode[]
  abstract addTextStyle (range: RangeNode, textStyle: TextStyleType): INode[]
  abstract deleteAllTextStyles (range: RangeNode): INode[]
  abstract deleteConcreteTextStyle (range: RangeNode, textStyle: TextStyleType): INode[]
  abstract mergeWithNode (node: INode, joinAfter: boolean): INode[]
}

export { BaseNodeContainer }
