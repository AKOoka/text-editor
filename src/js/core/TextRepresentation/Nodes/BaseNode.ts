import { INode, INodeCopy } from './INode'
import { TextStyleType } from '../../../common/TextStyleType'
import { NodeRepresentation, NodeRepresentationType } from '../NodeRepresentation'
import { RangeNode } from './RangeNode'
import { PositionNode } from './PositionNode'
import { NodeCreator } from './NodeCreator'
import { NodeUpdatesManager, TextEditorRepresentationUpdateNodeType } from '../NodeUpdatesManager'

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

  getRepresentation (): NodeRepresentation {
    this._representation.size = this._text.length
    this._representation.clearInstructions()
    this._representation.addTextInstruction(this._text)
    return this._representation
  }

  getSize (): number {
    return this._text.length
  }

  addText (position: PositionNode, text: string, nodeUpdateManager: NodeUpdatesManager): void {
    this._text = this._text.slice(0, position.position) + text + this._text.slice(position.position)
    nodeUpdateManager.addNodeUpdate(TextEditorRepresentationUpdateNodeType.CHANGE, [this.getRepresentation()])
    nodeUpdateManager.endPath()
  }

  deleteText (range: RangeNode, nodeUpdateManager: NodeUpdatesManager): boolean {
    this._text = this._text.slice(0, range.start) + this._text.slice(range.end)

    if (this._text.length === 0) {
      nodeUpdateManager.addNodeUpdate(TextEditorRepresentationUpdateNodeType.DELETE)
      nodeUpdateManager.endPath()
      return true
    } else {
      nodeUpdateManager.addNodeUpdate(TextEditorRepresentationUpdateNodeType.CHANGE, [this.getRepresentation()])
      nodeUpdateManager.endPath()
      return false
    }
  }

  abstract getContent (): INodeCopy[]
  abstract getContentInRange (range: RangeNode): INodeCopy[]
  abstract getTextStylesInRange (range: RangeNode): TextStyleType[]
  abstract addContent (position: PositionNode, content: INodeCopy[], parentTextStyles: TextStyleType[], nodeUpdatesManager: NodeUpdatesManager): INode[]
  abstract addTextStyle (range: RangeNode, textStyle: TextStyleType, nodeUpdateManager: NodeUpdatesManager): INode[]
  abstract deleteAllTextStyles (range: RangeNode, nodeUpdateManager: NodeUpdatesManager): INode[]
  abstract deleteConcreteTextStyle (range: RangeNode, textStyle: TextStyleType, nodeUpdateManager: NodeUpdatesManager): INode[]
}

export { BaseNode }
