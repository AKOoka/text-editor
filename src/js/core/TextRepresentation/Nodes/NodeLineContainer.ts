import { INode } from './INode'
import { NodeText } from './NodeText'
import { TextStyleType } from '../../../common/TextStyleType'
import { NodeStyleContainer } from './NodeStyleContainer'
import { BaseNodeContainer, ChildNodeInRangeCallback } from './BaseNodeContainer'
import { PositionNode } from './PositionNode'
import { RangeNode } from './RangeNode'
import { NodeRepresentationType } from '../NodeRepresentation'
import { NodeUpdatesManager, TextEditorRepresentationUpdateNodeType } from '../NodeUpdatesManager'

class NodeLineContainer extends BaseNodeContainer {
  constructor (childNodes: INode[]) {
    super(childNodes)
    this._representation.representationType = NodeRepresentationType.LINE
  }

  // for addText when it is only for textCursor i need to go from end to start and computing startOffset = size - child.size
  addText (position: PositionNode, text: string, nodeUpdatesManager: NodeUpdatesManager): void {
    let startOffset: number = position.offset
    this._size += text.length

    for (let i = 0; i < this._childNodes.length; i++) {
      if (position.childNodeInPosition(startOffset, this._childNodes[i].getSize())) {
        nodeUpdatesManager.addPath(i)
        this._childNodes[i].addText(new PositionNode(startOffset, position.initPosition), text, nodeUpdatesManager)
        nodeUpdatesManager.endPath()
        return
      }
      startOffset += this._childNodes[i].getSize()
    }

    const newNode: INode = new NodeText(text)
    nodeUpdatesManager.addPath(this._childNodes.length)
    nodeUpdatesManager.addNodeUpdate(TextEditorRepresentationUpdateNodeType.ADD, [newNode.getRepresentation()])
    this._childNodes.push(newNode)
  }

  addTextStyle (range: RangeNode, textStyle: TextStyleType, nodeUpdateManager: NodeUpdatesManager): INode[] {
    if (range.nodeInsideRange(this.getSize())) {
      this._childNodes = [new NodeStyleContainer(this._childNodes, textStyle)]
      nodeUpdateManager.addNodeUpdate(TextEditorRepresentationUpdateNodeType.CHANGE, [this.getRepresentation()])
      nodeUpdateManager.endPath()
      return [this]
    }

    const childNodeInRangeCallback: ChildNodeInRangeCallback<TextStyleType> =
      (rangeNode, childNode, textStyleType) => childNode.addTextStyle(rangeNode, textStyleType, nodeUpdateManager)
    this._childNodes = this._updateChildNodesInRange<TextStyleType>(childNodeInRangeCallback, range, textStyle, nodeUpdateManager)

    nodeUpdateManager.endPath()
    return [this]
  }

  deleteAllTextStyles (range: RangeNode, nodeUpdateManager: NodeUpdatesManager): INode[] {
    const childNodeInRange: ChildNodeInRangeCallback<null> =
      (range, childNode) => childNode.deleteAllTextStyles(range, nodeUpdateManager)
    this._childNodes = this._updateChildNodesInRange<null>(childNodeInRange, range, null, nodeUpdateManager)

    nodeUpdateManager.endPath()
    return [this]
  }

  deleteConcreteTextStyle (range: RangeNode, textStyle: TextStyleType, nodeUpdateManager: NodeUpdatesManager): INode[] {
    const childNodeInRange: ChildNodeInRangeCallback<TextStyleType> =
      (range, childNode, textStyleType) => childNode.deleteConcreteTextStyle(range, textStyleType, nodeUpdateManager)
    this._childNodes = this._updateChildNodesInRange<TextStyleType>(childNodeInRange, range, textStyle, nodeUpdateManager)

    nodeUpdateManager.endPath()
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
