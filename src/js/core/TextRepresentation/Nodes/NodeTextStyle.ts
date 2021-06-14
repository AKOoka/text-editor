import { INode, INodeCopy } from './INode'
import { TextStyleType } from '../../../common/TextStyleType'
import { NodeContainerStyle } from './NodeContainerStyle'
import { NodeText } from './NodeText'
import { BaseNode } from './BaseNode'
import { NodeRepresentation, NodeRepresentationType } from './NodeRepresentation'
import { RangeNode } from './RangeNode'
import { PositionNode } from './PositionNode'
import { NodeType } from './NodeType'
import { CreatedContent } from './CreatedContent'

class NodeTextStyle extends BaseNode {
  private readonly _textStyle: TextStyleType

  constructor (text: string, textStyle: TextStyleType) {
    super(text)
    this._textStyle = textStyle
    this._representation.representationType = NodeRepresentationType.TEXT
  }

  getNodeType (): NodeType {
    return NodeType.TEXT_STYLE
  }

  getStyle (): TextStyleType {
    return this._textStyle
  }

  addTextStyle (range: RangeNode, textStyle: TextStyleType): INode[] {
    let newNodes: INode[] = []

    if (textStyle === this._textStyle) {
      return [this]
    } else if (range.nodeInsideRange(this.getSize())) {
      newNodes = [new NodeContainerStyle([this], textStyle)]
    } else if (range.rangeInsideNode(this.getSize())) {
      const middleNodeTextStyle = new NodeTextStyle(this._text.slice(range.start, range.end), this._textStyle)
      const endNodeTextStyle = new NodeTextStyle(this._text.slice(range.end), this._textStyle)
      this._text = this._text.slice(0, range.start)
      newNodes = [
        this,
        new NodeContainerStyle([middleNodeTextStyle], textStyle),
        endNodeTextStyle
      ]
    } else if (range.nodeStartInRange(this.getSize())) {
      const newNodeTextStyle = new NodeTextStyle(this._text.slice(range.start), this._textStyle)
      this._text = this._text.slice(0, range.start)
      newNodes = [
        this,
        new NodeContainerStyle([newNodeTextStyle], textStyle)
      ]
    } else if (range.nodeEndInRange(this.getSize())) {
      const newNodeTextStyle = new NodeTextStyle(this._text.slice(0, range.end), this._textStyle)
      this._text = this._text.slice(range.end)
      newNodes = [
        new NodeContainerStyle([newNodeTextStyle], textStyle),
        this
      ]
    }

    return newNodes
  }

  deleteAllTextStyles (range: RangeNode): INode[] {
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

    return newNodes
  }

  deleteConcreteTextStyle (range: RangeNode, textStyle: TextStyleType): INode[] {
    if (textStyle !== this._textStyle) {
      return [this]
    }
    return this.deleteAllTextStyles(range)
  }

  getTextStylesInRange (range: RangeNode): TextStyleType[] {
    if (range.nodeInRange(this.getSize())) {
      return [this._textStyle]
    }
    return []
  }

  getContent (): INodeCopy[] {
    return [{
      type: NodeType.TEXT_STYLE,
      size: this._text.length,
      props: { text: this._text, textStyle: this._textStyle }
    }]
  }

  getContentInRange (range: RangeNode): INodeCopy[] {
    const text = this._text.slice(range.start, range.end)
    return [{
      type: NodeType.TEXT_STYLE,
      size: text.length,
      props: { text, textStyle: this._textStyle }
    }]
  }

  getRepresentation (): NodeRepresentation {
    const representation: NodeRepresentation = super.getRepresentation()
    representation.addStyleInstruction(this._textStyle)
    return representation
  }

  addContent (position: PositionNode, content: INodeCopy[], parentTextStyle: TextStyleType[]): CreatedContent {
    parentTextStyle.push(this._textStyle)

    const { nodes, nodeStyles } = super.addContent(position, content, parentTextStyle)
    let newNodes: INode[] = []

    if (parentTextStyle.includes(this._textStyle)) {
      newNodes = [new NodeContainerStyle(nodes, this._textStyle)]
    } else {
      newNodes = nodes
    }
    nodeStyles.push(this._textStyle)

    return { nodes: newNodes, nodeStyles }
  }
}

export { NodeTextStyle }
