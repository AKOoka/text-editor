import { INode } from './INode'
import { TextStyleType } from '../common/TextStyleType'
import { NodeStyleContainer } from './NodeStyleContainer'
import { NodeText } from './NodeText'
import { BaseNode } from './BaseNode'

class NodeTextStyle extends BaseNode {
  private readonly _textStyleType: TextStyleType

  constructor (text: string, textStyleType: TextStyleType) {
    super(text)
    this._textStyleType = textStyleType
  }

  addTextStyle (textStyleType: TextStyleType, offset: number, start: number, end: number = start + this.getSize()): Array<INode<HTMLElement>> {
    const startPosition: number = start - offset
    const endPosition: number = end - offset

    if (textStyleType === this._textStyleType) {
      return [this]
    } else if (startPosition <= 0 && endPosition >= this.getSize()) {
      return [new NodeStyleContainer(textStyleType, [this])]
    } else if (startPosition > 0 && endPosition < this.getSize()) {
      const middleNodeTextStyle = new NodeTextStyle(this._text.slice(startPosition, endPosition), this._textStyleType)
      const endNodeTextStyle = new NodeTextStyle(this._text.slice(endPosition), this._textStyleType)
      this._text = this._text.slice(0, startPosition)
      return [
        this,
        new NodeStyleContainer(textStyleType, [middleNodeTextStyle]),
        endNodeTextStyle
      ]
    } else if (startPosition > 0 && startPosition < this.getSize()) {
      const newNodeTextStyle = new NodeTextStyle(this._text.slice(startPosition), this._textStyleType)
      this._text = this._text.slice(0, startPosition)
      return [
        this,
        new NodeStyleContainer(textStyleType, [newNodeTextStyle])
      ]
    } else if (endPosition > 0 && endPosition < this.getSize()) {
      const newNodeTextStyle = new NodeTextStyle(this._text.slice(0, endPosition), this._textStyleType)
      this._text = this._text.slice(endPosition)
      return [
        new NodeStyleContainer(textStyleType, [newNodeTextStyle]),
        this
      ]
    }

    throw new Error("can't add new text style node to text style node")
  }

  removeAllTextStyles (offset: number, start: number, end: number = start + this.getSize()): Array<INode<HTMLElement>> {
    const startPosition: number = start - offset
    const endPosition: number = end - offset

    if (startPosition <= 0 && endPosition >= this.getSize()) {
      return [new NodeText(this._text)]
    } else if (startPosition > 0 && endPosition < this.getSize()) {
      const middleNodeText = new NodeText(this._text.slice(startPosition, endPosition))
      const endNodeTextStyle = new NodeTextStyle(this._text.slice(endPosition), this._textStyleType)
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

  removeConcreteTextStyle (textStyleType: TextStyleType, offset: number, start: number, end: number = start + this.getSize()): Array<INode<HTMLElement>> {
    if (textStyleType !== this._textStyleType) {
      return [this]
    }
    return this.removeAllTextStyles(offset, start, end)
  }

  textStylesInRange (offset: number, start: number, end: number = start + this.getSize()): TextStyleType[] {
    if (
      (start >= offset && start <= offset + this.getSize()) ||
      (end >= offset && end <= offset + this.getSize())
    ) {
      return [this._textStyleType]
    }
    return []
  }

  render (): HTMLElement {
    const element: HTMLElement = document.createElement('span')
    element.classList.add(`${this._textStyleType}-text`)
    element.textContent = this._text
    return element
  }
}

export { NodeTextStyle }
