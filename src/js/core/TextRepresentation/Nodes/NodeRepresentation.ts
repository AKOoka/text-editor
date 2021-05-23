import { NodeType } from './NodeType'

class NodeRepresentation {
  private _type: NodeType
  private _text: string
  private _textStyle: string
  private _children: NodeRepresentation[]

  setType (type: NodeType): NodeRepresentation {
    this._type = type
    return this
  }

  getType (): NodeType {
    return this._type
  }

  setText (text: string): NodeRepresentation {
    this._text = text
    return this
  }

  getText (): string {
    return this._text
  }

  setTextStyle (textStyle: string): NodeRepresentation {
    this._textStyle = textStyle
    return this
  }

  getTextStyle (): string {
    return this._textStyle
  }

  setChildren (children: NodeRepresentation[]): NodeRepresentation {
    this._children = children
    return this
  }

  getChildren (): NodeRepresentation[] {
    return this._children
  }
}

export { NodeRepresentation }
