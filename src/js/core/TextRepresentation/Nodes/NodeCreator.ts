import { NodeType } from './NodeType'
import { INode, INodeCopy, INodeCopyProps } from './INode'
import { NodeText } from './NodeText'
import { NodeTextStyle } from './NodeTextStyle'
import { NodeContainerLine } from './NodeContainerLine'
import { NodeContainerStyle } from './NodeContainerStyle'
import { TextStyleType } from '../../../common/TextStyleType'
import { CreatedContent } from './CreatedContent'

type NodeCreateFunction = (nodeProps: INodeCopyProps) => INode[]

export class NodeCreator {
  private readonly _nodeCreateFunctions: Record<NodeType, NodeCreateFunction>
  private readonly _forbiddenStyles: Set<TextStyleType>
  private _createNodeStyles: TextStyleType[]

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
    const { textStyle, text } = nodeProps
    if (this._forbiddenStyles.has(textStyle)) {
      return this._createNodeText(nodeProps)
    }
    this._forbiddenStyles.add(textStyle)
    this._createNodeStyles.push(textStyle)
    return [new NodeTextStyle(text, textStyle)]
  }

  private _createContainerLine (nodeProps: { children: INodeCopy[] }): INode[] {
    return [new NodeContainerLine(this._createNodes(nodeProps.children))]
  }

  private _createContainerStyle (nodeProps: { children: INodeCopy[], textStyle: TextStyleType }): INode[] {
    const { textStyle, children } = nodeProps
    const childNodes: INode[] = this._createNodes(children)
    if (this._forbiddenStyles.has(textStyle)) {
      return childNodes
    }
    this._forbiddenStyles.add(textStyle)
    this._createNodeStyles.push(textStyle)
    return [new NodeContainerStyle(childNodes, textStyle)]
  }

  private _createNodes (copies: INodeCopy[]): INode[] {
    let nodes: INode[] = []
    for (const copy of copies) {
      nodes = nodes.concat(this._nodeCreateFunctions[copy.type](copy.props))
    }
    return nodes
  }

  createNodeFromCopies (copies: INodeCopy[], forbiddenStyles: TextStyleType[] = []): CreatedContent {
    this._createNodeStyles = []

    for (const style of forbiddenStyles) {
      this._forbiddenStyles.add(style)
    }
    const nodes: INode[] = this._createNodes(copies)

    this._forbiddenStyles.clear()

    return { nodes, nodeStyles: this._createNodeStyles }
  }
}
