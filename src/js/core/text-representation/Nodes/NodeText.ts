import { CreatedContent, INode, INodeCopy, NodeType } from './INode'
import { NodeTextStyle } from './NodeTextStyle'
import { BaseNode } from './BaseNode'
import { NodeRepresentationType } from './NodeRepresentation'
import { PositionWithOffset } from '../line-with-nodes/util/PositionWithOffset'
import { TextStyle } from '../../../common/TextStyle'
import { RangeWithOffset } from '../line-with-nodes/util/RangeWithOffset'

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

  addTextStyle (range: RangeWithOffset, textStyleType: TextStyle): INode[] {
    let newNodes: INode[] = []

    if (range.isNodeInsideRange(this.getSize())) {
      newNodes = [new NodeTextStyle(this._text, textStyleType)]
    } else if (range.isRangeInsideNode(this.getSize())) {
      newNodes = [
        new NodeText(this._text.slice(0, range.startWithOffset)),
        new NodeTextStyle(this._text.slice(range.startWithOffset, range.endWithOffset), textStyleType),
        new NodeText(this._text.slice(range.endWithOffset))
      ]
    } else if (range.isNodeStartInRange(this.getSize())) {
      newNodes = [this, new NodeTextStyle(this._text.slice(range.startWithOffset), textStyleType)]
      this._text = this._text.slice(0, range.startWithOffset)
    } else if (range.isNodeEndInRange(this.getSize())) {
      newNodes = [new NodeTextStyle(this._text.slice(0, range.endWithOffset), textStyleType), this]
      this._text = this._text.slice(range.endWithOffset)
    }

    return newNodes
  }

  deleteTextStyleAll (_: RangeWithOffset): INode[] {
    return [this]
  }

  deleteTextStyleConcrete (_: RangeWithOffset, __: TextStyle): INode[] {
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

  getContentInRange (range: RangeWithOffset): INodeCopy[] {
    const text = this._text.slice(range.startWithOffset, range.endWithOffset)
    return [{
      type: NodeType.TEXT,
      size: text.length,
      props: { text }
    }]
  }

  addContent (position: PositionWithOffset, content: INodeCopy[], parentTextStyle: TextStyle[]): CreatedContent {
    return super.addContent(position, content, parentTextStyle)
  }
}

export { NodeText }
