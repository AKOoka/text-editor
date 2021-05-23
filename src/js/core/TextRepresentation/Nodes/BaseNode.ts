import { INode } from './INode'
import { TextStyleType } from '../../../common/TextStyleType'
import { BaseNodeContainer } from './BaseNodeContainer'
import { NodeRepresentation } from './NodeRepresentation'

abstract class BaseNode implements INode {
  protected _text: string
  protected _representation: NodeRepresentation

  protected constructor (text: string) {
    this._text = text
    this._representation = new NodeRepresentation()
  }

  mergeWithNode (node: INode): INode[] {
    if (node.getStyle() !== this.getStyle()) {
      return [this, node]
    }

    if (node instanceof BaseNodeContainer) {
      return node.mergeWithNode(this, false)
    } else if (node instanceof BaseNode) {
      this._text += node.getText()
    }
    return [this]
  }

  getText (): string {
    return this._text
  }

  getSize (): number {
    return this._text.length
  }

  addText (text: string, offset: number, position: number): void {
    this._text = this._text.slice(0, position - offset) + text + this._text.slice(position - offset)
  }

  removeText (offset: number, start: number, end: number): boolean {
    this._text = this._text.slice(0, start - offset) + this._text.slice(end - offset)
    return this._text.length === 0
  }

  abstract getStyle (): TextStyleType | null
  abstract addTextStyle (offset: number, start: number, end: number, textStyleType: TextStyleType): INode[]
  abstract removeAllTextStyles (offset: number, start: number, end: number): INode[]
  abstract removeConcreteTextStyle (offset: number, start: number, end: number, textStyleType: TextStyleType): INode[]
  abstract textStylesInRange (offset: number, start: number, end: number): TextStyleType[]
  abstract getRepresentation (): NodeRepresentation
}

export { BaseNode }
