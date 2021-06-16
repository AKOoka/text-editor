import { CreatedContent, INode, INodeCopy, INodeCopyProps, NodeType } from './INode'
import { NodeText } from './NodeText'
import { NodeTextStyle } from './NodeTextStyle'
import { NodeContainerLine } from './NodeContainerLine'
import { NodeContainerStyle } from './NodeContainerStyle'
import { TextStyle } from '../../../common/TextStyle'

type NodeCreateFunction = (nodeProps: INodeCopyProps) => INode[]

export class NodeCreator {
  private readonly _nodeCreateFunctions: Record<NodeType, NodeCreateFunction>
  private readonly _forbiddenStyles: Set<TextStyle>
  private _createNodeStyles: TextStyle[]

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

  private _createNodeTextStyle (nodeProps: { text: string, textStyle: TextStyle }): INode[] {
    const { textStyle, text } = nodeProps
    if (textStyle.inside(this._forbiddenStyles.values())) {
      return this._createNodeText(nodeProps)
    }
    this._forbiddenStyles.add(textStyle)
    this._createNodeStyles.push(textStyle)
    return [new NodeTextStyle(text, textStyle)]
  }

  private _createContainerLine (nodeProps: { children: INodeCopy[] }): INode[] {
    return [new NodeContainerLine(this._createNodes(nodeProps.children))]
  }

  private _createContainerStyle (nodeProps: { children: INodeCopy[], textStyle: TextStyle }): INode[] {
    const { textStyle, children } = nodeProps
    const childNodes: INode[] = this._createNodes(children)
    if (textStyle.inside(this._forbiddenStyles.values())) {
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

  createNodeFromCopies (copies: INodeCopy[], forbiddenStyles: TextStyle[] = []): CreatedContent {
    this._createNodeStyles = []

    for (const style of forbiddenStyles) {
      this._forbiddenStyles.add(style)
    }
    const nodes: INode[] = this._createNodes(copies)

    this._forbiddenStyles.clear()

    return { nodes, nodeStyles: this._createNodeStyles }
  }
}
