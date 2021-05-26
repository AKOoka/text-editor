import { INode } from './INode'
import { TextStyleType } from '../../../common/TextStyleType'
import { BaseNodeContainer } from './BaseNodeContainer'
import { NodeRepresentation } from './NodeRepresentation'
import { NodeType } from './NodeType'
import { NodeStyleContainer } from './NodeStyleContainer'
import { NodeText } from './NodeText'
import { NodeTextStyle } from './NodeTextStyle'

abstract class BaseNode implements INode {
  protected _text: string
  protected _representation: NodeRepresentation

  protected constructor (text: string) {
    this._text = text
    this._representation = new NodeRepresentation()
  }

  protected _createNodeFromContent (content: NodeRepresentation, parentTextStyles: TextStyleType[]): INode[] {
    if (content.type === NodeType.CONTAINER_STYLE) {
      const childNodes: INode[] = []
      for (const childContent of content.children) {
        childNodes.push(...this._createNodeFromContent(childContent, parentTextStyles))
      }
      if (parentTextStyles.includes(content.textStyle)) {
        return childNodes
      } else {
        return [new NodeStyleContainer(childNodes, content.textStyle)]
      }
    } else if (content.type === NodeType.TEXT_STYLE) {
      if (parentTextStyles.includes(content.textStyle)) {
        return [new NodeText(content.text)]
      } else {
        return [new NodeTextStyle(content.text, content.textStyle)]
      }
    } else if (content.type === NodeType.TEXT) {
      return [new NodeText(content.text)]
    }

    throw new Error(`can't create node from ${content.type} content`)
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

  getContentInRange (offset: number, startX: number, endX: number): NodeRepresentation {
    const content: NodeRepresentation = new NodeRepresentation()
    content.text = this._text.slice(startX - offset, endX - offset)
    content.size = content.text.length
    return content
  }

  getRepresentation (): NodeRepresentation {
    this._representation.text = this._text
    this._representation.size = this._text.length
    return this._representation
  }

  abstract addContent (content: NodeRepresentation[], offset: number, x: number, parentTextStyle: TextStyleType[]): INode[]
  abstract getStyle (): TextStyleType | null
  abstract addTextStyle (offset: number, start: number, end: number, textStyleType: TextStyleType): INode[]
  abstract removeAllTextStyles (offset: number, start: number, end: number): INode[]
  abstract removeConcreteTextStyle (offset: number, start: number, end: number, textStyleType: TextStyleType): INode[]
  abstract textStylesInRange (offset: number, start: number, end: number): TextStyleType[]
}

export { BaseNode }
