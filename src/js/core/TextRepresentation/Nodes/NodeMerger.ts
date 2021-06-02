import {
  INode,
  INodeContainerStyleProps,
  INodeCopy,
  INodeTextCopyProps,
  INodeTextStyleCopyProps
} from './INode'
import { NodeType } from './NodeType'
import { NodeText } from './NodeText'
import { NodeTextStyle } from './NodeTextStyle'
import { NodeStyleContainer } from './NodeStyleContainer'
import { NodeCreator } from './NodeCreator'

interface IMergeResult {
  mergePosition: number
  mergedNodes: INode[]
}

type MergingNodes = [INodeCopy, INodeCopy]

type MergeFunction = (mergingNodes: MergingNodes) => INode[]

export class NodeMerger {
  private _nodeToMerge: INode | null
  private _mergePosition: number
  private _mergeResults: IMergeResult[]
  private readonly _mergeFunctions: Record<NodeType, MergeFunction>
  private readonly _nodeCreator: NodeCreator

  constructor () {
    this._mergeResults = []
    this._mergeFunctions = {
      [NodeType.TEXT]: this._mergeTextNode,
      [NodeType.TEXT_STYLE]: this._mergeTextStyleNode,
      [NodeType.CONTAINER_STYLE]: this._mergeContainerStyle,
      [NodeType.CONTAINER_LINE] () { throw new Error("can't merge line") }
    }
    this._nodeCreator = new NodeCreator()
  }

  get mergeResults (): IMergeResult[] {
    return this._mergeResults
  }

  private _mergeTextNode (mergingNodes: [INodeCopy<INodeTextCopyProps>, INodeCopy<INodeTextCopyProps>]): INode[] {
    return [new NodeText(mergingNodes[0].nodeProps.text + mergingNodes[1].nodeProps.text)]
  }

  private _mergeTextStyleNode (mergingNodes: [INodeCopy<INodeTextStyleCopyProps>, INodeCopy<INodeTextCopyProps>]): INode[] {
    return [
      new NodeTextStyle(
        mergingNodes[0].nodeProps.text + mergingNodes[1].nodeProps.text,
        mergingNodes[0].nodeProps.textStyle
      )
    ]
  }

  private _mergeContainerStyle (mergingNodes: [INodeCopy<INodeContainerStyleProps>, INodeCopy]): INode[] {
    const [leftCopy, rightCopy] = mergingNodes
    const childNodes: INode[] = this._nodeCreator.createNodeFromCopies(leftCopy.nodeProps.children).concat(this._nodeCreator.createNodeFromCopies([rightCopy]))
    return [new NodeStyleContainer(childNodes, leftCopy.nodeProps.textStyle)]
  }

  private _mergeNodes (mergingNodes: [INodeCopy, INodeCopy]): INode[] {
    const [leftCopy, rightCopy] = mergingNodes
    if (rightCopy.nodeType === NodeType.TEXT) {
      return this._mergeFunctions[leftCopy.nodeType](mergingNodes)
    } else if (rightCopy.nodeType === NodeType.CONTAINER_STYLE && leftCopy.nodeProps.textStyle !== rightCopy.nodeProps.textStyle) {
      return this._mergeFunctions[rightCopy.nodeType]([rightCopy, leftCopy])
    } else if (rightCopy.nodeType === NodeType.TEXT_STYLE && leftCopy.nodeType === NodeType.TEXT) {
      return this._mergeFunctions[rightCopy.nodeType]([rightCopy, leftCopy])
    }

    throw new Error(`can't merge ${leftCopy.nodeType} with ${rightCopy.nodeType}`)
  }

  addFirstMergeNode (position: number, node: INode): void {
    this._mergePosition = position
    this._nodeToMerge = node
  }

  addSecondMergeNode (node: INode): void {
    if (this._nodeToMerge === null) {
      return
    }

    const leftCopy = this._nodeToMerge.getContent()[0]
    const rightCopy = node.getContent()[0]

    if (
      (leftCopy.nodeType !== NodeType.TEXT && rightCopy.nodeType !== NodeType.TEXT) &&
      (leftCopy.nodeProps.textStyle !== rightCopy.nodeProps.textStyle)
    ) {
      this._mergeResults.push({ mergePosition: this._mergePosition, mergedNodes: [this._nodeToMerge, node] })
    } else {
      this._mergeResults.push({
        mergePosition: this._mergePosition,
        mergedNodes: this._mergeNodes([leftCopy, rightCopy])
      })
    }

    this._nodeToMerge = null
  }

  clear (): void {
    this._mergeResults = []
    this._nodeToMerge = null
  }
}
