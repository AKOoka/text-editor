import { INode, INodeCopy } from './INode'
import { TextStyleType } from '../../../common/TextStyleType'
import { NodeContainerStyle } from './NodeContainerStyle'
import { BaseNodeContainer, ChildNodeInRangeCallback } from './BaseNodeContainer'
import { PositionNode } from './PositionNode'
import { RangeNode } from './RangeNode'
import { NodeRepresentationType } from './NodeRepresentation'
import { INodeUpdate } from './NodeUpdatesManager'
import { ITextEditorRepresentationLine } from '../ITextEditorRepresentationLine'
import { CreatedContent } from './CreatedContent'
import { NodeType } from './NodeType'
import { NodeText } from './NodeText'

class NodeContainerLine extends BaseNodeContainer implements ITextEditorRepresentationLine {
  constructor (childNodes: INode[] = []) {
    super(childNodes)
    this._representation.representationType = NodeRepresentationType.LINE
  }

  getNodeType (): NodeType {
    return NodeType.CONTAINER_LINE
  }

  getStyle (): null {
    return null
  }

  getUpdates (): INodeUpdate[] {
    return []
  }

  addText (position: PositionNode, text: string): void {
    if (this._childNodes.length === 0) {
      const newNode = new NodeText('')
      this._childNodes.push(newNode)
    }
    super.addText(position, text)
  }

  addTextStyle (range: RangeNode, textStyle: TextStyleType): INode[] {
    if (range.nodeInsideRange(this.getSize())) {
      this._childNodes = [new NodeContainerStyle(this._childNodes, textStyle)]
      return [this]
    }

    const childNodeInRangeCallback: ChildNodeInRangeCallback<TextStyleType> =
      (rangeNode, childNode, textStyleType) => childNode.addTextStyle(rangeNode, textStyleType)
    this._childNodes = this._updateChildNodesInRange<TextStyleType>(childNodeInRangeCallback, range, textStyle)

    return [this]
  }

  addContent (position: PositionNode, content: INodeCopy[]): CreatedContent {
    if (this._childNodes.length === 0) {
      const { nodes, nodeStyles } = this._nodeCreator.createNodeFromCopies(content, [])
      for (const node of nodes) {
        this._childNodes.push(node)
        this._size += node.getSize()
      }
      nodeStyles.forEach(c => this._childStyles.add(c))
      return { nodes, nodeStyles }
    }
    const createdContent = super.addContent(position, content, [])
    for (const style of createdContent.nodeStyles) {
      this._childStyles.add(style)
    }
    return createdContent
  }

  deleteAllTextStyles (range: RangeNode): INode[] {
    if (range.nodeInsideRange(this.getSize())) {
      this._childStyles.clear()
    }

    const childNodeInRange: ChildNodeInRangeCallback<null> =
      (range, childNode) => childNode.deleteAllTextStyles(range)
    this._childNodes = this._updateChildNodesInRange<null>(childNodeInRange, range, null)

    return [this]
  }

  deleteConcreteTextStyle (range: RangeNode, textStyle: TextStyleType): INode[] {
    const childNodeInRange: ChildNodeInRangeCallback<TextStyleType> =
      (range, childNode, textStyleType) => childNode.deleteConcreteTextStyle(range, textStyleType)
    this._childNodes = this._updateChildNodesInRange<TextStyleType>(childNodeInRange, range, textStyle)

    return [this]
  }

  deleteText (range: RangeNode): boolean {
    if (range.nodeInsideRange(this.getSize())) {
      this._childNodes = []
      this._childStyles.clear()
      this._size = 0
      return true
    }

    return super.deleteText(range)
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

export { NodeContainerLine }
