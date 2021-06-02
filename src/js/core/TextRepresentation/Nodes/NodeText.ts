import { TextStyleType } from '../../../common/TextStyleType'
import { INode, INodeCopy } from './INode'
import { NodeTextStyle } from './NodeTextStyle'
import { BaseNode } from './BaseNode'
import { NodeRepresentationType } from '../NodeRepresentation'
import { RangeNode } from './RangeNode'
import { PositionNode } from './PositionNode'
import { NodeUpdatesManager, TextEditorRepresentationUpdateNodeType } from '../NodeUpdatesManager'
import { NodeType } from './NodeType'

class NodeText extends BaseNode {
  constructor (text: string) {
    super(text)
    this._representation.representationType = NodeRepresentationType.TEXT
  }

  addTextStyle (range: RangeNode, textStyleType: TextStyleType, nodeUpdatesManager: NodeUpdatesManager): INode[] {
    let newNodes: INode[] = []

    if (range.nodeInsideRange(this.getSize())) {
      newNodes = [new NodeTextStyle(this._text, textStyleType)]
    } else if (range.rangeInsideNode(this.getSize())) {
      newNodes = [
        new NodeText(this._text.slice(0, range.start)),
        new NodeTextStyle(this._text.slice(range.start, range.end), textStyleType),
        new NodeText(this._text.slice(range.end))
      ]
    } else if (range.nodeStartInRange(this.getSize())) {
      this._text = this._text.slice(0, range.start)
      newNodes = [this, new NodeTextStyle(this._text.slice(range.start), textStyleType)]
    } else if (range.nodeEndInRange(this.getSize())) {
      this._text = this._text.slice(range.end)
      newNodes = [new NodeTextStyle(this._text.slice(0, range.end), textStyleType), this]
    }

    nodeUpdatesManager.addNodeUpdate(TextEditorRepresentationUpdateNodeType.CHANGE, newNodes.map(n => n.getRepresentation()))
    nodeUpdatesManager.endPath()

    return newNodes
  }

  deleteAllTextStyles (): INode[] {
    return [this]
  }

  deleteConcreteTextStyle (): INode[] {
    return [this]
  }

  getTextStylesInRange (): TextStyleType[] {
    return []
  }

  getContent (): INodeCopy[] {
    return [{
      nodeType: NodeType.TEXT,
      nodeProps: { text: this._text }
    }]
  }

  getContentInRange (range: RangeNode): INodeCopy[] {
    return [{
      nodeType: NodeType.TEXT,
      nodeProps: { text: this._text.slice(range.start, range.end) }
    }]
  }

  addContent (position: PositionNode, content: INodeCopy[], parentTextStyle: TextStyleType[], nodeUpdatesManager: NodeUpdatesManager): INode[] {
    const newNodes: INode[] = [
      new NodeText(this._text.slice(0, position.position)),
      ...this._nodeCreator.createNodeFromCopies(content, parentTextStyle)
    ]
    nodeUpdatesManager.addNodeUpdate(
      TextEditorRepresentationUpdateNodeType.CHANGE,
      [newNodes[0].getRepresentation(), ...newNodes.map(c => c.getRepresentation())]
    )
    nodeUpdatesManager.endPath()
    return newNodes
  }
}

export { NodeText }
