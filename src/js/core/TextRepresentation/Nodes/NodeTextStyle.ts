import { INode } from './INode'
import { TextStyleType } from '../../../common/TextStyleType'
import { NodeStyleContainer } from './NodeStyleContainer'
import { NodeText } from './NodeText'
import { BaseNode } from './BaseNode'
import { NodeRepresentation } from '../NodeRepresentation'
import { NodeType } from './NodeType'
import { RangeNode } from './RangeNode'
import { PositionNode } from './PositionNode'

class NodeTextStyle extends BaseNode {
  private readonly _textStyle: TextStyleType

  constructor (text: string, textStyle: TextStyleType) {
    super(text)
    this._textStyle = textStyle
    this._representation.type = NodeType.TEXT_STYLE
    this._representation.textStyle = textStyle
  }

  getStyle (): TextStyleType | null {
    return this._textStyle
  }

  addTextStyle (range: RangeNode, textStyle: TextStyleType): INode[] {
    if (textStyle === this._textStyle) {
      return [this]
    } else if (range.nodeInsideRange(this.getSize())) {
      return [new NodeStyleContainer([this], textStyle)]
    } else if (range.rangeInsideNode(this.getSize())) {
      const middleNodeTextStyle = new NodeTextStyle(this._text.slice(range.start, range.end), this._textStyle)
      const endNodeTextStyle = new NodeTextStyle(this._text.slice(range.end), this._textStyle)
      this._text = this._text.slice(0, range.start)
      return [
        this,
        new NodeStyleContainer([middleNodeTextStyle], textStyle),
        endNodeTextStyle
      ]
    } else if (range.nodeStartInRange(this.getSize())) {
      const newNodeTextStyle = new NodeTextStyle(this._text.slice(range.start), this._textStyle)
      this._text = this._text.slice(0, range.start)
      return [
        this,
        new NodeStyleContainer([newNodeTextStyle], textStyle)
      ]
    } else if (range.nodeEndInRange(this.getSize())) {
      const newNodeTextStyle = new NodeTextStyle(this._text.slice(0, range.end), this._textStyle)
      this._text = this._text.slice(range.end)
      return [
        new NodeStyleContainer([newNodeTextStyle], textStyle),
        this
      ]
    }

    throw new Error("can't add new text style node to text style node")
  }

  deleteAllTextStyles (range: RangeNode): INode[] {
    if (range.nodeInsideRange(this.getSize())) {
      return [new NodeText(this._text)]
    } else if (range.rangeInsideNode(this.getSize())) {
      const middleNodeText = new NodeText(this._text.slice(range.start, range.end))
      const endNodeTextStyle = new NodeTextStyle(this._text.slice(range.end), this._textStyle)
      this._text = this._text.slice(0, range.start)
      return [this, middleNodeText, endNodeTextStyle]
    } else if (range.nodeStartInRange(this.getSize())) {
      const textNode = new NodeText(this._text.slice(range.start))
      this._text = this._text.slice(0, range.start)
      return [this, textNode]
    } else if (range.nodeEndInRange(this.getSize())) {
      const textNode = new NodeText(this._text.slice(0, range.end))
      this._text = this._text.slice(range.end)
      return [textNode, this]
    }
    throw new Error("can't remove all text styles from text style node")
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

  getContentInRange (range: RangeNode): NodeRepresentation {
    const content: NodeRepresentation = super.getContentInRange(range)
    content.type = this._representation.type
    content.textStyle = this._textStyle
    return content
  }

  addContent (position: PositionNode, content: NodeRepresentation[], parentTextStyle: TextStyleType[]): INode[] {
    const newNodes: INode[] = [new NodeText(this._text.slice(0, position.position))]
    parentTextStyle.push(this._textStyle)
    for (const c of content) {
      newNodes.push(...this._createNodeFromContent(c, parentTextStyle))
    }
    newNodes.push(new NodeText(this._text.slice(position.position)))
    return [new NodeStyleContainer(newNodes, this._textStyle)]
  }
}

export { NodeTextStyle }
