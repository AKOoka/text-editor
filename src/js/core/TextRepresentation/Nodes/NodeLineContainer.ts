import { INode } from './INode'
import { NodeText } from './NodeText'
import { TextStyleType } from '../../../common/TextStyleType'
import { NodeStyleContainer } from './NodeStyleContainer'
import { BaseNodeContainer } from './BaseNodeContainer'
import { ChildNodeInRangeCallback } from './ChildNodeInRangeCallback'
import { NodeType } from './NodeType'
import { NodeRepresentation } from './NodeRepresentation'

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

  addTextStyle (offset: number, start: number, end: number, textStyle: TextStyleType): INode[] {
    if (start <= offset && end >= offset + this.getSize()) {
      this._childNodes = [new NodeStyleContainer(this._childNodes, textStyle)]
      return [this]
    }

    const childNodeInRange: ChildNodeInRangeCallback<TextStyleType> = (childNode, offset, start, end, textStyleType) => {
      return childNode.addTextStyle(offset, start, end, textStyleType)
    }
    this._childNodes = this._mergeNodes(
      this._updateChildNodesInRange<TextStyleType>(childNodeInRange, offset, start, end, textStyle)
    )

    return [this]
  }

  removeAllTextStyles (offset: number, start: number, end: number): INode[] {
    const childNodeInRange: ChildNodeInRangeCallback<null> = (childNode, offset, start, end) => {
      return childNode.removeAllTextStyles(offset, start, end)
    }
    this._childNodes = this._mergeNodes(
      this._updateChildNodesInRange<null>(childNodeInRange, offset, start, end, null)
    )

    return [this]
  }

  removeConcreteTextStyle (offset: number, start: number, end: number, textStyle: TextStyleType): INode[] {
    const childNodeInRange: ChildNodeInRangeCallback<TextStyleType> = (childNode, offset, start, end, textStyleType) => {
      return childNode.removeConcreteTextStyle(offset, start, end, textStyleType)
    }
    this._childNodes = this._mergeNodes(
      this._updateChildNodesInRange<TextStyleType>(childNodeInRange, offset, start, end, textStyle)
    )

    return [this]
  }

  addContent (content: NodeRepresentation[], offset: number, x: number, parentTextStyles: TextStyleType[]): INode[] {
    let startOffset: number = offset
    for (let i = 0; i < this._childNodes.length; i++) {
      const childSize: number = this._childNodes[i].getSize()
      if (this._nodeInPosition(startOffset, x, this._childNodes[i].getSize())) {
        this._childNodes.splice(i, 1, ...this._childNodes[i].addContent(content, startOffset, x, parentTextStyles))
        return [this]
      }
      startOffset += childSize
    }
    return [this]
  }

  getContentInRange (offset: number, startX: number, endX: number): NodeRepresentation {
    const content: NodeRepresentation = super.getContentInRange(offset, startX, endX)
    content.type = this._representation.type
    return content
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
}

export { NodeLineContainer }
