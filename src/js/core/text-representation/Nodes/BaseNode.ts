import { CreatedContent, INode, INodeCopy, NodeType } from './INode'
import { NodeRepresentation, NodeRepresentationType } from './NodeRepresentation'
import { PositionWithOffset } from '../line-with-nodes/util/PositionWithOffset'
import { NodeCreator } from './NodeCreator'
import { NodeText } from './NodeText'
import { TextStyle } from '../../../common/TextStyle'
import { RangeWithOffset } from '../line-with-nodes/util/RangeWithOffset'

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

  addText (position: PositionWithOffset, text: string): void {
    this._text = this._text.slice(0, position.positionWithOffset) + text + this._text.slice(position.positionWithOffset)
  }

  deleteText (range: RangeWithOffset): boolean {
    this._text = this._text.slice(0, range.startWithOffset) + this._text.slice(range.endWithOffset)
    return this._text.length === 0
  }

  addContent (position: PositionWithOffset, content: INodeCopy[], parentTextStyles: TextStyle[]): CreatedContent {
    let newNodes: INode[] = []
    const { nodes, nodeStyles } = this._nodeCreator.createNodeFromCopies(content, parentTextStyles)
    if (position.positionWithOffset === 0) {
      newNodes = [...nodes, new NodeText(this._text)]
    } else if (position.positionWithOffset === this._text.length) {
      newNodes = [new NodeText(this._text), ...nodes]
    } else {
      newNodes = [
        new NodeText(this._text.slice(0, position.positionWithOffset)),
        ...nodes,
        new NodeText(this._text.slice(position.positionWithOffset))
      ]
    }

    return { nodes: newNodes, nodeStyles }
  }

  abstract getNodeType (): NodeType
  abstract getStyle (): TextStyle | null
  abstract getContent (): INodeCopy[]
  abstract getContentInRange (range: RangeWithOffset): INodeCopy[]
  abstract getTextStylesInRange (range: RangeWithOffset): TextStyle[]
  abstract addTextStyle (range: RangeWithOffset, textStyle: TextStyle): INode[]
  abstract deleteTextStyleAll (range: RangeWithOffset): INode[]
  abstract deleteTextStyleConcrete (range: RangeWithOffset, textStyle: TextStyle): INode[]
}

export { BaseNode }
