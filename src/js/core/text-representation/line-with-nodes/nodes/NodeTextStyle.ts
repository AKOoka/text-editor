import { TextStyle } from '../../../../common/TextStyle'
import { INodeTextStyle, NodeType } from './Node'

export class NodeTextStyle implements INodeTextStyle {
  private readonly _type: NodeType.TEXT_STYLE
  private _size: number
  private _text: string
  private readonly _style: TextStyle

  get type (): NodeType.TEXT_STYLE {
    return this._type
  }

  get size (): number {
    return this._size
  }

  get text (): string {
    return this._text
  }

  set text (value: string) {
    this._text = value
    this._size = this._text.length
  }

  get style (): TextStyle {
    return this._style
  }

  constructor (text: string, style: TextStyle) {
    this._text = text
    this._size = this._text.length
    this._type = NodeType.TEXT_STYLE
    this._style = style
  }
}
