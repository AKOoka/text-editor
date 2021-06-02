import { INode, INodeCopy } from './INode'
import { TextStyleType } from '../../../common/TextStyleType'
import { NodeStyleContainer } from './NodeStyleContainer'
import { NodeText } from './NodeText'
import { BaseNode } from './BaseNode'
import { NodeRepresentation, NodeRepresentationType } from '../NodeRepresentation'
import { RangeNode } from './RangeNode'
import { PositionNode } from './PositionNode'
import { NodeUpdatesManager, TextEditorRepresentationUpdateNodeType } from '../NodeUpdatesManager'
import { NodeType } from './NodeType'

class NodeTextStyle extends BaseNode {
  private readonly _textStyle: TextStyleType

  constructor (text: string, textStyle: TextStyleType) {
    super(text)
    this._textStyle = textStyle
    this._representation.representationType = NodeRepresentationType.TEXT
  }

  addTextStyle (range: RangeNode, textStyle: TextStyleType, nodeUpdatesManager: NodeUpdatesManager): INode[] {
    let newNodes: INode[] = []

    if (textStyle === this._textStyle) {
      return [this]
    } else if (range.nodeInsideRange(this.getSize())) {
      newNodes = [new NodeStyleContainer([this], textStyle)]
    } else if (range.rangeInsideNode(this.getSize())) {
      const middleNodeTextStyle = new NodeTextStyle(this._text.slice(range.start, range.end), this._textStyle)
      const endNodeTextStyle = new NodeTextStyle(this._text.slice(range.end), this._textStyle)
      this._text = this._text.slice(0, range.start)
      newNodes = [
        this,
        new NodeStyleContainer([middleNodeTextStyle], textStyle),
        endNodeTextStyle
      ]
    } else if (range.nodeStartInRange(this.getSize())) {
      const newNodeTextStyle = new NodeTextStyle(this._text.slice(range.start), this._textStyle)
      this._text = this._text.slice(0, range.start)
      newNodes = [
        this,
        new NodeStyleContainer([newNodeTextStyle], textStyle)
      ]
    } else if (range.nodeEndInRange(this.getSize())) {
      const newNodeTextStyle = new NodeTextStyle(this._text.slice(0, range.end), this._textStyle)
      this._text = this._text.slice(range.end)
      newNodes = [
        new NodeStyleContainer([newNodeTextStyle], textStyle),
        this
      ]
    }

    nodeUpdatesManager.addNodeUpdate(TextEditorRepresentationUpdateNodeType.CHANGE, newNodes.map(n => n.getRepresentation()))
    nodeUpdatesManager.endPath()

    return newNodes
  }

  deleteAllTextStyles (range: RangeNode, nodeUpdatesManager: NodeUpdatesManager): INode[] {
    let newNodes: INode[] = []

    if (range.nodeInsideRange(this.getSize())) {
      newNodes = [new NodeText(this._text)]
    } else if (range.rangeInsideNode(this.getSize())) {
      const middleNodeText = new NodeText(this._text.slice(range.start, range.end))
      const endNodeTextStyle = new NodeTextStyle(this._text.slice(range.end), this._textStyle)
      this._text = this._text.slice(0, range.start)
      newNodes = [this, middleNodeText, endNodeTextStyle]
    } else if (range.nodeStartInRange(this.getSize())) {
      const textNode = new NodeText(this._text.slice(range.start))
      this._text = this._text.slice(0, range.start)
      newNodes = [this, textNode]
    } else if (range.nodeEndInRange(this.getSize())) {
      const textNode = new NodeText(this._text.slice(0, range.end))
      this._text = this._text.slice(range.end)
      newNodes = [textNode, this]
    }

    nodeUpdatesManager.addNodeUpdate(TextEditorRepresentationUpdateNodeType.CHANGE, newNodes.map(n => n.getRepresentation()))
    nodeUpdatesManager.endPath()

    return newNodes
  }

  deleteConcreteTextStyle (range: RangeNode, textStyle: TextStyleType, nodeUpdatesManager: NodeUpdatesManager): INode[] {
    if (textStyle !== this._textStyle) {
      return [this]
    }
    return this.deleteAllTextStyles(range, nodeUpdatesManager)
  }

  getTextStylesInRange (range: RangeNode): TextStyleType[] {
    if (range.nodeInRange(this.getSize())) {
      return [this._textStyle]
    }
    return []
  }

  getContent (): INodeCopy[] {
    return [{
      nodeType: NodeType.TEXT_STYLE,
      nodeProps: { text: this._text, textStyle: this._textStyle }
    }]
  }

  getContentInRange (range: RangeNode): INodeCopy[] {
    return [{
      nodeType: NodeType.TEXT_STYLE,
      nodeProps: { text: this._text.slice(range.start, range.end), textStyle: this._textStyle }
    }]
  }

  getRepresentation (): NodeRepresentation {
    const representation: NodeRepresentation = super.getRepresentation()
    representation.addStyleInstruction(this._textStyle)
    return representation
  }

  addContent (position: PositionNode, content: INodeCopy[], parentTextStyle: TextStyleType[], nodeUpdatesManager: NodeUpdatesManager): INode[] {
    parentTextStyle.push(this._textStyle)
    const newNode = new NodeStyleContainer(
      [
        new NodeText(this._text.slice(0, position.position)),
        ...this._nodeCreator.createNodeFromCopies(content, parentTextStyle),
        new NodeText(this._text.slice(position.position))
      ],
      this._textStyle
    )

    nodeUpdatesManager.addNodeUpdate(TextEditorRepresentationUpdateNodeType.CHANGE, [newNode.getRepresentation()])
    nodeUpdatesManager.endPath()

    return [newNode]
  }
}

export { NodeTextStyle }
