import { INode } from './INode'
import { NodeText } from './NodeText'
import { TextStyleType } from '../../../common/TextStyleType'
import { NodeStyleContainer } from './NodeStyleContainer'
import { BaseNodeContainer } from './BaseNodeContainer'
import { ChildNodeInRangeCallback } from './ChildNodeInRangeCallback'
import { NodeType } from './NodeType'
import { PositionNode } from './PositionNode'
import { RangeNode } from './RangeNode'

class NodeLineContainer extends BaseNodeContainer {
  constructor (childNodes: INode[]) {
    super(childNodes)
    this._representation.type = NodeType.CONTAINER_LINE
  }

  getStyle (): TextStyleType | null {
    return null
  }

  mergeWithNode (): INode[] {
    throw new Error("Node Line Container can't be joined to another node because it must always be single on the top of hierarchy")
  }

  // for addText when it is only for textCursor i need to go from end to start and computing startOffset = size - child.size
  addText (position: PositionNode, text: string): void {
    let startOffset: number = position.offset
    this._size += text.length

    for (const child of this._childNodes) {
      if (position.childNodeInPosition(startOffset, child.getSize())) {
        child.addText(new PositionNode(startOffset, position.initPosition), text)
        return
      }
      startOffset += child.getSize()
    }

    this._childNodes.push(new NodeText(text))
  }

  addTextStyle (range: RangeNode, textStyle: TextStyleType): INode[] {
    if (range.nodeInsideRange(this.getSize())) {
      this._childNodes = [new NodeStyleContainer(this._childNodes, textStyle)]
      return [this]
    }

    const childNodeInRangeCallback: ChildNodeInRangeCallback<TextStyleType> =
      (rangeNode, childNode, textStyleType) => childNode.addTextStyle(rangeNode, textStyleType)
    this._childNodes = this._mergeNodes(
      this._updateChildNodesInRange<TextStyleType>(childNodeInRangeCallback, range, textStyle)
    )

    return [this]
  }

  deleteAllTextStyles (range: RangeNode): INode[] {
    const childNodeInRange: ChildNodeInRangeCallback<null> =
      (range, childNode) => childNode.deleteAllTextStyles(range)
    this._childNodes = this._mergeNodes(
      this._updateChildNodesInRange<null>(childNodeInRange, range, null)
    )

    return [this]
  }

  deleteConcreteTextStyle (range: RangeNode, textStyle: TextStyleType): INode[] {
    const childNodeInRange: ChildNodeInRangeCallback<TextStyleType> =
      (range, childNode, textStyleType) => childNode.deleteConcreteTextStyle(range, textStyleType)
    this._childNodes = this._mergeNodes(
      this._updateChildNodesInRange<TextStyleType>(childNodeInRange, range, textStyle)
    )

    return [this]
  }

  getTextStylesInRange (range: RangeNode): TextStyleType[] {
    let startOffset: number = range.offset

    if (range.childNodeInRange(startOffset, this.getSize())) {
      let textStyles: TextStyleType[] = []

      for (const childNode of this._childNodes) {
        textStyles = textStyles.concat(childNode.getTextStylesInRange(new RangeNode(startOffset, range.initStart, range.initEnd)))
        startOffset += childNode.getSize()
      }

      return textStyles
    }

    return []
  }
}

export { NodeLineContainer }
