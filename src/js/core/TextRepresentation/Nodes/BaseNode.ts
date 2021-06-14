import { INode, INodeCopy } from './INode'
import { TextStyleType } from '../../../common/TextStyleType'
import { NodeRepresentation, NodeRepresentationType } from './NodeRepresentation'
import { RangeNode } from './RangeNode'
import { PositionNode } from './PositionNode'
import { NodeCreator } from './NodeCreator'
import { NodeType } from './NodeType'
import { NodeText } from './NodeText'
import { CreatedContent } from './CreatedContent'

abstract class BaseNode implements INode {
  protected _text: string
  protected _nodeCreator: NodeCreator
  protected _representation: NodeRepresentation

  protected constructor (text: string) {
    this._text = text
    this._nodeCreator = new NodeCreator()
    this._representation = new NodeRepresentation()
    this._representation.representationType = NodeRepresentationType.TEXT
  }

  getText (): string {
    return this._text
  }

  getRepresentation (): NodeRepresentation {
    this._representation.size = this._text.length
    this._representation.clearInstructions()
    this._representation.addTextInstruction(this._text)
    return this._representation
  }

  getSize (): number {
    return this._text.length
  }

  addText (position: PositionNode, text: string): void {
    this._text = this._text.slice(0, position.position) + text + this._text.slice(position.position)
  }

  deleteText (range: RangeNode): boolean {
    this._text = this._text.slice(0, range.start) + this._text.slice(range.end)
    return this._text.length === 0
  }

  addContent (position: PositionNode, content: INodeCopy[], parentTextStyles: TextStyleType[]): CreatedContent {
    let newNodes: INode[] = []
    const { nodes, nodeStyles } = this._nodeCreator.createNodeFromCopies(content, parentTextStyles)
    if (position.position === 0) {
      newNodes = [...nodes, new NodeText(this._text)]
    } else if (position.position === this._text.length) {
      newNodes = [new NodeText(this._text), ...nodes]
    } else {
      newNodes = [
        new NodeText(this._text.slice(0, position.position)),
        ...nodes,
        new NodeText(this._text.slice(position.position))
      ]
    }

    return { nodes: newNodes, nodeStyles }
  }

  abstract getNodeType (): NodeType
  abstract getStyle (): TextStyleType | null
  abstract getContent (): INodeCopy[]
  abstract getContentInRange (range: RangeNode): INodeCopy[]
  abstract getTextStylesInRange (range: RangeNode): TextStyleType[]
  abstract addTextStyle (range: RangeNode, textStyle: TextStyleType): INode[]
  abstract deleteAllTextStyles (range: RangeNode): INode[]
  abstract deleteConcreteTextStyle (range: RangeNode, textStyle: TextStyleType): INode[]
}

export { BaseNode }
