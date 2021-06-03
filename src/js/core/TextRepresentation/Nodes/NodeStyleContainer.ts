import { INode, INodeCopy } from './INode'
import { TextStyleType } from '../../../common/TextStyleType'
import { BaseNodeContainer, ChildNodeInRangeCallback } from './BaseNodeContainer'
import { NodeRepresentation, NodeRepresentationType } from '../NodeRepresentation'
import { PositionNode } from './PositionNode'
import { RangeNode } from './RangeNode'
import { NodeType } from './NodeType'
import { NodeUpdatesManager, TextEditorRepresentationUpdateNodeType } from '../NodeUpdatesManager'

class NodeStyleContainer extends BaseNodeContainer {
  private readonly _textStyle: TextStyleType

  constructor (childNodes: INode[], textStyle: TextStyleType) {
    super(childNodes)
    this._textStyle = textStyle
    this._representation.representationType = NodeRepresentationType.TEXT
  }

  addText (position: PositionNode, text: string, nodeUpdateManager: NodeUpdatesManager): void {
    let startOffset: number = position.offset

    for (let i = 0; i < this._childNodes.length; i++) {
      if (position.childNodeInPosition(startOffset, this._childNodes[i].getSize())) {
        nodeUpdateManager.addPath(i)
        this._childNodes[i].addText(new PositionNode(startOffset, position.initPosition), text, nodeUpdateManager)
        this._size += text.length
        nodeUpdateManager.endPath()
        return
      }
      startOffset += this._childNodes[i].getSize()
    }

    throw new Error("can't add text to node style container")
  }

  addTextStyle (range: RangeNode, textStyle: TextStyleType, nodeUpdatesManager: NodeUpdatesManager): INode[] {
    if (textStyle === this._textStyle) {
      nodeUpdatesManager.endPath()
      return [this]
    } else if (range.nodeInsideRange(this.getSize())) {
      const newNode = new NodeStyleContainer([this], textStyle)
      nodeUpdatesManager.addNodeUpdate(TextEditorRepresentationUpdateNodeType.CHANGE, [newNode.getRepresentation()])
      nodeUpdatesManager.endPath()
      return [newNode]
    }

    const childNodeInRange: ChildNodeInRangeCallback<TextStyleType> =
      (range, childNode, textStyleType) => childNode.addTextStyle(range, textStyleType, nodeUpdatesManager)
    this._childNodes = this._updateChildNodesInRange<TextStyleType>(childNodeInRange, range, textStyle, nodeUpdatesManager)

    nodeUpdatesManager.endPath()
    return [this]
  }

  deleteAllTextStyles (range: RangeNode, nodeUpdatesManager: NodeUpdatesManager): INode[] {
    if (range.nodeInsideRange(this.getSize())) {
      nodeUpdatesManager.savePositionInRoute()
      let offset: number = 0
      for (const childNode of this._childNodes) {
        childNode.deleteAllTextStyles(new RangeNode(offset, range.start, range.end), nodeUpdatesManager)
        offset += childNode.getSize()
      }
      nodeUpdatesManager.mergeUpdatesFromSavedPosition()
      nodeUpdatesManager.endPath()
      return this._childNodes
    }

    const childNodeInRange: ChildNodeInRangeCallback<null> =
      (range, childNode) => childNode.deleteAllTextStyles(range, nodeUpdatesManager)
    this._childNodes = this._updateChildNodesInRange<null>(childNodeInRange, range, null, nodeUpdatesManager)

    nodeUpdatesManager.endPath()
    return [this]
  }

  private _findLeftNodeIndexInRange (range: RangeNode): number {
    let childStartOffset: number = range.offset

    for (let i = 0; i < this._childNodes.length; i++) {
      const childNodeSize: number = this._childNodes[i].getSize()

      if (range.childNodeInRange(childStartOffset, childNodeSize)) {
        return i
      }

      childStartOffset += childNodeSize
    }

    throw new Error("couldn't find left node to split NodeStyleContainer")
  }

  private _findRightNodeIndexInRange (range: RangeNode): number {
    let childStartOffset: number = range.offset + this.getSize()

    for (let i = this._childNodes.length - 1; i >= 0; i--) {
      const childNodeSize: number = this._childNodes[i].getSize()

      if (range.childNodeInRange(childStartOffset, childNodeSize)) {
        return i
      }

      childStartOffset -= childNodeSize
    }

    throw new Error("couldn't find right node to split NodeStyleContainer")
  }

  deleteConcreteTextStyle (range: RangeNode, textStyle: TextStyleType, nodeUpdateManager: NodeUpdatesManager): INode[] {
    if (textStyle === this._textStyle) {
      // temporary solution - NEED TO REFACTOR
      let newNodes: INode[] = []

      if (range.nodeInsideRange(this.getSize())) {
        newNodes = this._childNodes
      } else if (range.rangeInsideNode(this.getSize())) {
        const leftNodeIndexInRange: number = this._findLeftNodeIndexInRange(range)
        const rightNodeIndexInRange: number = this._findRightNodeIndexInRange(range)
        const rightNodeStyleContainer: INode = new NodeStyleContainer(
          this._childNodes.slice(rightNodeIndexInRange), this._textStyle
        )
        const nodesWithoutStyleContainer: INode[] = this._childNodes.slice(leftNodeIndexInRange, rightNodeIndexInRange)
        this._childNodes = this._childNodes.slice(0, leftNodeIndexInRange)
        newNodes = ([this] as INode[]).concat(nodesWithoutStyleContainer, rightNodeStyleContainer)
      } else if (range.nodeStartInRange(this.getSize())) {
        const rightNodeIndexInRange: number = this._findRightNodeIndexInRange(range)
        const nodesWithoutStyleContainer: INode[] = this._childNodes.slice(rightNodeIndexInRange)
        this._childNodes = this._childNodes.slice(0, rightNodeIndexInRange)
        newNodes = ([this] as INode[]).concat(nodesWithoutStyleContainer)
      } else if (range.nodeEndInRange(this.getSize())) {
        const leftNodeIndexInRange: number = this._findLeftNodeIndexInRange(range)
        const nodesWithoutStyleContainer: INode[] = this._childNodes.slice(0, leftNodeIndexInRange)
        this._childNodes = this._childNodes.slice(leftNodeIndexInRange)
        newNodes = nodesWithoutStyleContainer.concat([this])
      }

      nodeUpdateManager.addNodeUpdate(TextEditorRepresentationUpdateNodeType.CHANGE, newNodes.map(n => n.getRepresentation()))
      nodeUpdateManager.endPath()

      return newNodes
    }

    const childNodeInRange: ChildNodeInRangeCallback<TextStyleType> =
      (range, childNode, textStyle) => childNode.deleteConcreteTextStyle(range, textStyle, nodeUpdateManager)
    this._childNodes = this._updateChildNodesInRange<TextStyleType>(childNodeInRange, range, textStyle, nodeUpdateManager)

    nodeUpdateManager.endPath()

    return [this]
  }

  getTextStylesInRange (range: RangeNode): TextStyleType[] {
    let startOffset: number = range.offset

    if (range.childNodeInRange(startOffset, this.getSize())) {
      let textStyles: TextStyleType[] = [this._textStyle]

      for (const childNode of this._childNodes) {
        textStyles = textStyles.concat(childNode.getTextStylesInRange(new RangeNode(startOffset, range.initStart, range.initEnd)))
        startOffset += childNode.getSize()
      }

      return textStyles
    }

    return []
  }

  addContent (position: PositionNode, content: INodeCopy[], parentTextStyles: TextStyleType[], nodeUpdatesManager: NodeUpdatesManager): INode[] {
    parentTextStyles.push(this._textStyle)
    super.addContent(position, content, parentTextStyles, nodeUpdatesManager)
    nodeUpdatesManager.endPath()
    return [this]
  }

  getContent (): INodeCopy[] {
    const children = super.getContent()
    return [{
      type: NodeType.CONTAINER_LINE,
      size: children.reduce((p, c) => p + c.size, 0),
      props: { textStyle: this._textStyle, children }
    }]
  }

  getContentInRange (range: RangeNode): INodeCopy[] {
    const children = super.getContentInRange(range)
    return [{
      type: NodeType.CONTAINER_STYLE,
      size: children.reduce((p, c) => p + c.size, 0),
      props: { textStyle: this._textStyle, children }
    }]
  }

  getRepresentation (): NodeRepresentation {
    const representation: NodeRepresentation = super.getRepresentation()
    representation.addStyleInstruction(this._textStyle)
    return representation
  }
}

export { NodeStyleContainer }
