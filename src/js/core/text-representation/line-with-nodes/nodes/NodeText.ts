import { INodeText, NodeType } from './INode'

export class NodeText implements INodeText {
  private readonly _type: NodeType.TEXT
  private _size: number
  private _text: string

  get type (): NodeType.TEXT {
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

  constructor (text: string) {
    this._text = text
    this._size = this._text.length
    this._type = NodeType.TEXT
  }
}
