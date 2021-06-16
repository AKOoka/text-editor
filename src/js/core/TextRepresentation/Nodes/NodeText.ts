import { CreatedContent, INode, INodeCopy, NodeType } from './INode'
import { NodeTextStyle } from './NodeTextStyle'
import { BaseNode } from './BaseNode'
import { NodeRepresentationType } from './NodeRepresentation'
import { RangeNode } from './RangeNode'
import { PositionNode } from './PositionNode'
import { TextStyle } from '../../../common/TextStyle'

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

  addTextStyle (range: RangeNode, textStyleType: TextStyle): INode[] {
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
      newNodes = [this, new NodeTextStyle(this._text.slice(range.start), textStyleType)]
      this._text = this._text.slice(0, range.start)
    } else if (range.nodeEndInRange(this.getSize())) {
      newNodes = [new NodeTextStyle(this._text.slice(0, range.end), textStyleType), this]
      this._text = this._text.slice(range.end)
    }

    return newNodes
  }

  deleteAllTextStyles (_: RangeNode): INode[] {
    return [this]
  }

  deleteConcreteTextStyle (_: RangeNode, __: TextStyle): INode[] {
    return [this]
  }

  getTextStylesInRange (): TextStyle[] {
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

  addContent (position: PositionNode, content: INodeCopy[], parentTextStyle: TextStyle[]): CreatedContent {
    return super.addContent(position, content, parentTextStyle)
  }
}

export { NodeText }
