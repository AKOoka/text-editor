import { TextStyleType } from '../../../common/TextStyleType'
import { INode } from './INode'
import { NodeTextStyle } from './NodeTextStyle'
import { BaseNode } from './BaseNode'
import { NodeRepresentation } from './NodeRepresentation'
import { NodeType } from './NodeType'

class NodeText extends BaseNode {
  constructor (text: string) {
    super(text)
    this._representation.setType(NodeType.TEXT)
  }

  getStyle (): TextStyleType | null {
    return null
  }

  addTextStyle (offset: number, start: number, end: number, textStyleType: TextStyleType): INode[] {
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

  removeAllTextStyles (): INode[] {
    return [this]
  }

  removeConcreteTextStyle (): INode[] {
    return [this]
  }

  textStylesInRange (): TextStyleType[] {
    return []
  }

  getRepresentation (): NodeRepresentation {
    return this._representation.setText(this._text)
  }
}

export { NodeText }
