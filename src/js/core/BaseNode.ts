import { INode } from './INode'
import { TextStyleType } from '../common/TextStyleType'
import { BaseNodeContainer } from './BaseNodeContainer'

abstract class BaseNode implements INode<HTMLElement> {
  protected _text: string

  constructor (text: string) {
    this._text = text
  }

  mergeWithNode (node: INode<HTMLElement>, joinAfter: boolean): Array<INode<HTMLElement>> {
    if (node.getStyleType() !== this.getStyleType()) {
      if (joinAfter) {
        return [this, node]
      }
      return [node, this]
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

  removeText (offset: number, start: number, end: number = start + this.getSize()): boolean {
    this._text = this._text.slice(0, start - offset) + this._text.slice(end - offset)
    return this._text.length === 0
  }

  abstract getStyleType (): TextStyleType | null
  abstract addTextStyle (textStyleType: TextStyleType, offset: number, start: number, end?: number): Array<INode<HTMLElement>>
  abstract removeAllTextStyles (offset: number, start: number, end?: number): Array<INode<HTMLElement>>
  abstract removeConcreteTextStyle (textStyleType: TextStyleType, offset: number, start: number, end?: number): Array<INode<HTMLElement>>
  abstract textStylesInRange (offset: number, start: number, end?: number): TextStyleType[]
  abstract render (): HTMLElement
}

export { BaseNode }
