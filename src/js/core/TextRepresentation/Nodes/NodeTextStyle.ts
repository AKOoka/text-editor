import { INode } from './INode'
import { TextStyleType } from '../../../common/TextStyleType'
import { NodeStyleContainer } from './NodeStyleContainer'
import { NodeText } from './NodeText'
import { BaseNode } from './BaseNode'
import { NodeRepresentation } from './NodeRepresentation'
import { NodeType } from './NodeType'

class NodeTextStyle extends BaseNode {
  private readonly _textStyle: TextStyleType

  constructor (text: string, textStyle: TextStyleType) {
    super(text)
    this._textStyle = textStyle
    this._representation
      .setType(NodeType.TEXT_STYLE)
      .setTextStyle(textStyle)
  }

  getStyle (): TextStyleType | null {
    return this._textStyle
  }

  addTextStyle (offset: number, start: number, end: number, textStyle: TextStyleType): INode[] {
    const startPosition: number = start - offset
    const endPosition: number = end - offset

    if (textStyle === this._textStyle) {
      return [this]
    } else if (startPosition <= 0 && endPosition >= this.getSize()) {
      return [new NodeStyleContainer([this], textStyle)]
    } else if (startPosition > 0 && endPosition < this.getSize()) {
      const middleNodeTextStyle = new NodeTextStyle(this._text.slice(startPosition, endPosition), this._textStyle)
      const endNodeTextStyle = new NodeTextStyle(this._text.slice(endPosition), this._textStyle)
      this._text = this._text.slice(0, startPosition)
      return [
        this,
        new NodeStyleContainer([middleNodeTextStyle], textStyle),
        endNodeTextStyle
      ]
    } else if (startPosition > 0 && startPosition < this.getSize()) {
      const newNodeTextStyle = new NodeTextStyle(this._text.slice(startPosition), this._textStyle)
      this._text = this._text.slice(0, startPosition)
      return [
        this,
        new NodeStyleContainer([newNodeTextStyle], textStyle)
      ]
    } else if (endPosition > 0 && endPosition < this.getSize()) {
      const newNodeTextStyle = new NodeTextStyle(this._text.slice(0, endPosition), this._textStyle)
      this._text = this._text.slice(endPosition)
      return [
        new NodeStyleContainer([newNodeTextStyle], textStyle),
        this
      ]
    }

    throw new Error("can't add new text style node to text style node")
  }

  removeAllTextStyles (offset: number, start: number, end: number): INode[] {
    const startPosition: number = start - offset
    const endPosition: number = end - offset

    if (startPosition <= 0 && endPosition >= this.getSize()) {
      return [new NodeText(this._text)]
    } else if (startPosition > 0 && endPosition < this.getSize()) {
      const middleNodeText = new NodeText(this._text.slice(startPosition, endPosition))
      const endNodeTextStyle = new NodeTextStyle(this._text.slice(endPosition), this._textStyle)
      this._text = this._text.slice(0, startPosition)
      return [this, middleNodeText, endNodeTextStyle]
    } else if (startPosition > 0 && startPosition < this.getSize()) {
      const textNode = new NodeText(this._text.slice(startPosition))
      this._text = this._text.slice(0, startPosition)
      return [this, textNode]
    } else if (endPosition > 0 && endPosition < this.getSize()) {
      const textNode = new NodeText(this._text.slice(0, endPosition))
      this._text = this._text.slice(endPosition)
      return [textNode, this]
    }
    throw new Error("can't remove all text styles from text style node")
  }

  removeConcreteTextStyle (offset: number, start: number, end: number, textStyle: TextStyleType): INode[] {
    if (textStyle !== this._textStyle) {
      return [this]
    }
    return this.removeAllTextStyles(offset, start, end)
  }

  textStylesInRange (offset: number, start: number, end: number): TextStyleType[] {
    if (
      (start >= offset && start <= offset + this.getSize()) ||
      (end >= offset && end <= offset + this.getSize())
    ) {
      return [this._textStyle]
    }
    return []
  }

  getRepresentation (): NodeRepresentation {
    return this._representation.setText(this._text)

  }
}

export { NodeTextStyle }
