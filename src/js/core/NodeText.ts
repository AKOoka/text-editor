import { TextStyleType } from '../common/TextStyleType'
import { INode } from './INode'
import { NodeTextStyle } from './NodeTextStyle'
import { BaseNode } from './BaseNode'

class NodeText extends BaseNode {
  addTextStyle (textStyleType: TextStyleType, offset: number, start: number, end: number = start + this.getSize()): Array<INode<HTMLElement>> {
    const startPosition: number = start - offset
    const endPosition: number = end - offset

    if (startPosition <= 0 && endPosition >= this.getSize()) {
      return [new NodeTextStyle(this._text, textStyleType)]
    } else if (startPosition > 0 && endPosition < this.getSize()) {
      return [
        new NodeText(this._text.slice(0, startPosition)),
        new NodeTextStyle(this._text.slice(startPosition, endPosition), textStyleType),
        new NodeText(this._text.slice(endPosition))
      ]
    } else if (startPosition > 0 && startPosition < this.getSize()) {
      const textStyleNode = new NodeTextStyle(this._text.slice(startPosition), textStyleType)
      this._text = this._text.slice(0, startPosition)
      return [this, textStyleNode]
    } else if (endPosition > 0 && endPosition < this.getSize()) {
      const textStyleNode = new NodeTextStyle(this._text.slice(0, endPosition), textStyleType)
      this._text = this._text.slice(endPosition)
      return [textStyleNode, this]
    }

    throw new Error("can't add text style to text node")
  }

  removeAllTextStyles (): Array<INode<HTMLElement>> {
    return [this]
  }

  removeConcreteTextStyle (): Array<INode<HTMLElement>> {
    return [this]
  }

  textStylesInRange (): TextStyleType[] {
    return []
  }

  render (): HTMLElement {
    const element: HTMLElement = document.createElement('span')
    element.textContent = this._text
    return element
  }
}

export { NodeText }
