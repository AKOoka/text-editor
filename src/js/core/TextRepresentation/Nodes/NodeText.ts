import { TextStyleType } from '../../../common/TextStyleType'
import { INode } from './INode'
import { NodeTextStyle } from './NodeTextStyle'
import { BaseNode } from './BaseNode'
import { NodeRepresentation } from '../NodeRepresentation'
import { NodeType } from './NodeType'
import { RangeNode } from './RangeNode'
import { PositionNode } from './PositionNode'

class NodeText extends BaseNode {
  constructor (text: string) {
    super(text)
    this._representation.type = NodeType.TEXT
  }

  getStyle (): TextStyleType | null {
    return null
  }

  addTextStyle (range: RangeNode, textStyleType: TextStyleType): INode[] {
    if (range.nodeInsideRange(this.getSize())) {
      return [new NodeTextStyle(this._text, textStyleType)]
    } else if (range.rangeInsideNode(this.getSize())) {
      return [
        new NodeText(this._text.slice(0, range.start)),
        new NodeTextStyle(this._text.slice(range.start, range.end), textStyleType),
        new NodeText(this._text.slice(range.end))
      ]
    } else if (range.nodeStartInRange(this.getSize())) {
      const textStyleNode = new NodeTextStyle(this._text.slice(range.start), textStyleType)
      this._text = this._text.slice(0, range.start)
      return [this, textStyleNode]
    } else if (range.nodeEndInRange(this.getSize())) {
      const textStyleNode = new NodeTextStyle(this._text.slice(0, range.end), textStyleType)
      this._text = this._text.slice(range.end)
      return [textStyleNode, this]
    }

    throw new Error("can't add text style to text node")
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

  addContent (position: PositionNode, content: NodeRepresentation[], parentTextStyle: TextStyleType[]): INode[] {
    const newNodes: INode[] = [new NodeText(this._text.slice(0, position.position))]
    for (const c of content) {
      newNodes.push(...this._createNodeFromContent(c, parentTextStyle))
    }
    return newNodes
  }
}

export { NodeText }
