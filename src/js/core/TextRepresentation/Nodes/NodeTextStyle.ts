import { CreatedContent, INode, INodeCopy, NodeType } from './INode'
import { NodeContainerStyle } from './NodeContainerStyle'
import { NodeText } from './NodeText'
import { BaseNode } from './BaseNode'
import { NodeRepresentation, NodeRepresentationType } from './NodeRepresentation'
import { RangeWithOffset } from '../../../common/RangeWithOffset'
import { PositionWithOffset } from '../../../common/PositionWithOffset'
import { TextStyle } from '../../../common/TextStyle'

class NodeTextStyle extends BaseNode {
  private readonly _textStyle: TextStyle

  constructor (text: string, textStyle: TextStyle) {
    super(text)
    this._textStyle = textStyle
    this._representation.representationType = NodeRepresentationType.TEXT
  }

  getNodeType (): NodeType {
    return NodeType.TEXT_STYLE
  }

  getStyle (): TextStyle {
    return this._textStyle
  }

  addTextStyle (range: RangeWithOffset, textStyle: TextStyle): INode[] {
    let newNodes: INode[] = []

    if (textStyle === this._textStyle) {
      return [this]
    } else if (range.isNodeInsideRange(this.getSize())) {
      newNodes = [new NodeContainerStyle([this], textStyle)]
    } else if (range.isRangeInsideNode(this.getSize())) {
      newNodes = [
        this,
        new NodeContainerStyle(
          [new NodeTextStyle(this._text.slice(range.startWithOffset, range.endWithOffset), this._textStyle)],
          textStyle
        ),
        new NodeTextStyle(this._text.slice(range.endWithOffset), this._textStyle)
      ]
      this._text = this._text.slice(0, range.startWithOffset)
    } else if (range.isNodeStartInRange(this.getSize())) {
      newNodes = [
        this,
        new NodeContainerStyle(
          [new NodeTextStyle(this._text.slice(range.startWithOffset), this._textStyle)],
          textStyle
        )
      ]
      this._text = this._text.slice(0, range.startWithOffset)
    } else if (range.isNodeEndInRange(this.getSize())) {
      newNodes = [
        new NodeContainerStyle(
          [new NodeTextStyle(this._text.slice(0, range.endWithOffset), this._textStyle)],
          textStyle
        ),
        this
      ]
      this._text = this._text.slice(range.endWithOffset)
    }

    return newNodes
  }

  deleteTextStyleAll (range: RangeWithOffset): INode[] {
    let newNodes: INode[] = []

    if (range.isNodeInsideRange(this.getSize())) {
      newNodes = [new NodeText(this._text)]
    } else if (range.isRangeInsideNode(this.getSize())) {
      const middleNodeText = new NodeText(this._text.slice(range.startWithOffset, range.endWithOffset))
      const endNodeTextStyle = new NodeTextStyle(this._text.slice(range.endWithOffset), this._textStyle)
      this._text = this._text.slice(0, range.startWithOffset)
      newNodes = [this, middleNodeText, endNodeTextStyle]
    } else if (range.isNodeStartInRange(this.getSize())) {
      const textNode = new NodeText(this._text.slice(range.startWithOffset))
      this._text = this._text.slice(0, range.startWithOffset)
      newNodes = [this, textNode]
    } else if (range.isNodeEndInRange(this.getSize())) {
      const textNode = new NodeText(this._text.slice(0, range.endWithOffset))
      this._text = this._text.slice(range.endWithOffset)
      newNodes = [textNode, this]
    }

    return newNodes
  }

  deleteTextStyleConcrete (range: RangeWithOffset, textStyle: TextStyle): INode[] {
    if (textStyle !== this._textStyle) {
      return [this]
    }
    return this.deleteTextStyleAll(range)
  }

  getTextStylesInRange (range: RangeWithOffset): TextStyle[] {
    if (range.isNodeInRange(this.getSize())) {
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

  getContentInRange (range: RangeWithOffset): INodeCopy[] {
    const text = this._text.slice(range.startWithOffset, range.endWithOffset)
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

  addContent (position: PositionWithOffset, content: INodeCopy[], parentTextStyle: TextStyle[]): CreatedContent {
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
