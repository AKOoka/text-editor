import { NodeType } from './NodeType'
import { INode, INodeCopy, INodeCopyProps } from './INode'
import { NodeText } from './NodeText'
import { NodeTextStyle } from './NodeTextStyle'
import { NodeLineContainer } from './NodeLineContainer'
import { NodeStyleContainer } from './NodeStyleContainer'
import { TextStyleType } from '../../../common/TextStyleType'

type NodeCreateFunction = (nodeProps: INodeCopyProps) => INode[]

export class NodeCreator {
  private readonly _nodeCreateFunctions: Record<NodeType, NodeCreateFunction>
  private readonly _forbiddenStyles: Set<TextStyleType>

  constructor () {
    this._nodeCreateFunctions = {
      [NodeType.TEXT]: this._createNodeText,
      [NodeType.TEXT_STYLE]: this._createNodeTextStyle,
      [NodeType.CONTAINER_LINE]: this._createContainerLine,
      [NodeType.CONTAINER_STYLE]: this._createContainerStyle
    }
    this._forbiddenStyles = new Set()
  }

  private _createNodeText (nodeProps: { text: string }): INode[] {
    return [new NodeText(nodeProps.text)]
  }

  private _createNodeTextStyle (nodeProps: { text: string, textStyle: TextStyleType }): INode[] {
    if (this._forbiddenStyles.has(nodeProps.textStyle)) {
      return [new NodeText(nodeProps.text)]
    }
    this._forbiddenStyles.add(nodeProps.textStyle)
    return [new NodeTextStyle(nodeProps.text, nodeProps.textStyle)]
  }

  private _createContainerLine (nodeProps: { children: INodeCopy[] }): INode[] {
    return [new NodeLineContainer(this._createNodes(nodeProps.children))]
  }

  private _createContainerStyle (nodeProps: { children: INodeCopy[], textStyle: TextStyleType }): INode[] {
    const childNodes: INode[] = this._createNodes(nodeProps.children)
    if (this._forbiddenStyles.has(nodeProps.textStyle)) {
      return childNodes
    }
    this._forbiddenStyles.add(nodeProps.textStyle)
    return [new NodeStyleContainer(childNodes, nodeProps.textStyle)]
  }

  private _createNodes (copies: INodeCopy[]): INode[] {
    let nodes: INode[] = []
    for (const copy of copies) {
      nodes = nodes.concat(this._nodeCreateFunctions[copy.type](copy.props))
    }
    return nodes
  }

  createNodeFromCopies (copies: INodeCopy[], forbiddenStyles: TextStyleType[] = []): INode[] {
    for (const style of forbiddenStyles) {
      this._forbiddenStyles.add(style)
    }
    const nodes: INode[] = this._createNodes(copies)
    this._forbiddenStyles.clear()

    return nodes
  }
}
