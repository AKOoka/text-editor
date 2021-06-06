import { INode, INodeCopy } from './INode'
import { TextStyleType } from '../../../common/TextStyleType'
import { NodeContainerStyle } from './NodeContainerStyle'
import { BaseNodeContainer, ChildNodeInRangeCallback } from './BaseNodeContainer'
import { PositionNode } from './PositionNode'
import { RangeNode } from './RangeNode'
import { NodeRepresentationType } from './NodeRepresentation'
import { INodeUpdate, NodeUpdatesManager } from './NodeUpdatesManager'
import { ITextEditorRepresentationLine } from '../ITextEditorRepresentationLine'
import { CreatedContent } from './CreatedContent'
import { NodeType } from './NodeType'
import { NodeText } from './NodeText'

class NodeContainerLine extends BaseNodeContainer implements ITextEditorRepresentationLine {
  private readonly _nodeUpdatesManager: NodeUpdatesManager

  constructor (childNodes: INode[] = []) {
    super(childNodes)
    this._representation.representationType = NodeRepresentationType.LINE
    this._nodeUpdatesManager = new NodeUpdatesManager()

    if (childNodes.length === 0) {
      const newNode = new NodeText('')
      this._nodeUpdatesManager.addPath(0)
      this._childNodes.push(newNode)
      this._nodeUpdatesManager.nodeAdd(newNode)
      this._nodeUpdatesManager.endPath()
    }
  }

  getNodeType (): NodeType {
    return NodeType.CONTAINER_LINE
  }

  getStyle (): null {
    return null
  }

  getUpdates (): INodeUpdate[] {
    const updates = this._nodeUpdatesManager.nodeUpdates
    this._nodeUpdatesManager.clear()
    return updates
  }

  addText (position: PositionNode, text: string): void {
    super.addText(position, text, this._nodeUpdatesManager)
  }

  addTextStyle (range: RangeNode, textStyle: TextStyleType): INode[] {
    if (range.nodeInsideRange(this.getSize())) {
      this._childNodes = [new NodeContainerStyle(this._childNodes, textStyle)]
      this._nodeUpdatesManager.nodeChange([this])
      this._nodeUpdatesManager.endPath()
      return [this]
    }

    const childNodeInRangeCallback: ChildNodeInRangeCallback<TextStyleType> =
      (rangeNode, childNode, textStyleType) => childNode.addTextStyle(rangeNode, textStyleType, this._nodeUpdatesManager)
    this._childNodes = this._updateChildNodesInRange<TextStyleType>(childNodeInRangeCallback, range, textStyle, this._nodeUpdatesManager)

    return [this]
  }

  addContent (position: PositionNode, content: INodeCopy[]): CreatedContent {
    const createdContent = super.addContent(position, content, [], this._nodeUpdatesManager)
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
      (range, childNode) => childNode.deleteAllTextStyles(range, this._nodeUpdatesManager)
    this._childNodes = this._updateChildNodesInRange<null>(childNodeInRange, range, null, this._nodeUpdatesManager)

    return [this]
  }

  deleteConcreteTextStyle (range: RangeNode, textStyle: TextStyleType): INode[] {
    const childNodeInRange: ChildNodeInRangeCallback<TextStyleType> =
      (range, childNode, textStyleType) => childNode.deleteConcreteTextStyle(range, textStyleType, this._nodeUpdatesManager)
    this._childNodes = this._updateChildNodesInRange<TextStyleType>(childNodeInRange, range, textStyle, this._nodeUpdatesManager)

    return [this]
  }

  deleteText (range: RangeNode): boolean {
    if (range.nodeInsideRange(this.getSize())) {
      this._childNodes = []
      this._childStyles.clear()
      this._nodeUpdatesManager.nodeChange([this])
      this._nodeUpdatesManager.endPath()
      return true
    }

    return super.deleteText(range, this._nodeUpdatesManager)
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
