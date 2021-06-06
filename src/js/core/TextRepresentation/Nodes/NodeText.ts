import { TextStyleType } from '../../../common/TextStyleType'
import { INode, INodeCopy } from './INode'
import { NodeTextStyle } from './NodeTextStyle'
import { BaseNode } from './BaseNode'
import { NodeRepresentationType } from './NodeRepresentation'
import { RangeNode } from './RangeNode'
import { PositionNode } from './PositionNode'
import { NodeType } from './NodeType'
import { NodeUpdatesManager } from './NodeUpdatesManager'
import { CreatedContent } from './CreatedContent'

class NodeText extends BaseNode {
  constructor (text: string) {
    super(text)
    this._representation.representationType = NodeRepresentationType.TEXT
  }

  getNodeType (): NodeType {
    return NodeType.TEXT
  }

  getStyle (): null {
    return null
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

    nodeUpdatesManager.nodeChange(newNodes)
    nodeUpdatesManager.endPath()

    return newNodes
  }

  deleteAllTextStyles (_: RangeNode, nodeUpdatesManager: NodeUpdatesManager): INode[] {
    nodeUpdatesManager.endPath()
    return [this]
  }

  deleteConcreteTextStyle (_: RangeNode, __: TextStyleType, nodeUpdatesManager: NodeUpdatesManager): INode[] {
    nodeUpdatesManager.endPath()
    return [this]
  }

  getTextStylesInRange (): TextStyleType[] {
    return []
  }

  getContent (): INodeCopy[] {
    return [{
      type: NodeType.TEXT,
      size: this._text.length,
      props: { text: this._text }
    }]
  }

  getContentInRange (range: RangeNode): INodeCopy[] {
    const text = this._text.slice(range.start, range.end)
    return [{
      type: NodeType.TEXT,
      size: text.length,
      props: { text }
    }]
  }

  addContent (position: PositionNode, content: INodeCopy[], parentTextStyle: TextStyleType[], nodeUpdatesManager: NodeUpdatesManager): CreatedContent {
    const createdContent = super.addContent(position, content, parentTextStyle, nodeUpdatesManager)
    nodeUpdatesManager.nodeChange(createdContent.nodes)
    nodeUpdatesManager.endPath()

    return createdContent
  }
}

export { NodeText }
