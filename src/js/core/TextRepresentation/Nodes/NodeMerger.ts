import { INode } from './INode'
import { NodeType } from './NodeType'
import { NodeText } from './NodeText'
import { NodeTextStyle } from './NodeTextStyle'
import { NodeContainerStyle } from './NodeContainerStyle'
import { BaseNode } from './BaseNode'
import { BaseNodeContainer } from './BaseNodeContainer'

type MergingNodes = [INode, INode]

type MergeFunction = (mergingNodes: MergingNodes) => INode[]

export class NodeMerger {
  private _mergePositions: number[]
  private readonly _mergeFunctions: Record<NodeType, MergeFunction>

  constructor () {
    this._mergePositions = []
    this._mergeFunctions = {
      [NodeType.TEXT]: this._mergeTextNodes,
      [NodeType.TEXT_STYLE]: this._mergeTextStyleNodes,
      [NodeType.CONTAINER_STYLE]: this._mergeContainerStyles,
      [NodeType.CONTAINER_LINE] () { throw new Error("can't merge line") }
    }
  }

  private _mergeTextNodes (mergingNodes: [NodeText, NodeText]): INode[] {
    return [new NodeText(mergingNodes[0].getText() + mergingNodes[1].getText())]
  }

  private _mergeTextStyleNodes (mergingNodes: [NodeTextStyle, NodeTextStyle]): INode[] {
    return [
      new NodeTextStyle(
        mergingNodes[0].getText() + mergingNodes[1].getText(),
        mergingNodes[0].getStyle()
      )
    ]
  }

  private _mergeContainerStyles (mergingNodes: [NodeContainerStyle, INode]): INode[] {
    const [leftCopy, rightCopy] = mergingNodes
    const newChildren = leftCopy.getChildNodes()
    if (rightCopy instanceof BaseNode) {
      newChildren.push(new NodeText(rightCopy.getText()))
    } else if (rightCopy instanceof NodeContainerStyle) {
      newChildren.push(...rightCopy.getChildNodes())
    }
    return [new NodeContainerStyle(newChildren, leftCopy.getStyle())]
  }

  private _mergeNodes (mergingNodes: [INode, INode]): INode[] {
    const [leftNode, rightNode] = mergingNodes

    if (leftNode.getStyle() === rightNode.getStyle()) {
      return this._mergeFunctions[leftNode.getNodeType()](mergingNodes)
    } else if (leftNode.getNodeType() === NodeType.TEXT) {
      return this._mergeFunctions[rightNode.getNodeType()]([rightNode, leftNode])
    } else if (rightNode.getNodeType() === NodeType.TEXT) {
      return this._mergeFunctions[leftNode.getNodeType()](mergingNodes)
    }

    throw new Error(`can't merge ${leftNode.getNodeType()} with ${rightNode.getNodeType()}`)
  }

  private _isValidPosition (position: number): boolean {
    return position !== 0 && this._mergePositions[this._mergePositions.length - 1] !== position
  }

  private _getTextFromContainer (container: BaseNodeContainer): string {
    let text: string = ''

    for (const child of container.getChildNodes()) {
      if (child instanceof BaseNodeContainer) {
        text += this._getTextFromContainer(child)
      } else if (child instanceof BaseNode) {
        text += child.getText()
      }
    }

    return text
  }

  mergeNodesToNodeText (nodes: INode[]): NodeText {
    let text = ''

    for (const node of nodes) {
      if (node instanceof BaseNodeContainer) {
        text += this._getTextFromContainer(node)
      } else if (node instanceof BaseNode) {
        text += node.getText()
      }
    }

    return new NodeText(text)
  }

  savePositionDelete (position: number): void {
    if (this._isValidPosition(position)) {
      this._mergePositions.push(position - 1, position)
    }
  }

  savePositionChange (changeStart: number, changeEnd: number): void {
    if (this._isValidPosition(changeStart)) {
      this._mergePositions.push(changeStart - 1, changeStart)
    }
    if (this._isValidPosition(changeEnd)) {
      this._mergePositions.push(changeEnd, changeEnd + 1)
    }
  }

  savePositionAdd (addStart: number, addEnd: number): void {
    if (this._isValidPosition(addStart)) {
      this._mergePositions.push(addStart - 1, addStart)
    }
    if (this._isValidPosition(addEnd)) {
      this._mergePositions.push(addEnd, addEnd + 1)
    }
  }

  mergeNodesOnSavedPositions (nodes: INode[]): INode[] {
    if (this._mergePositions.length <= 1) {
      return nodes
    }

    const mergedNodes: INode[] = []
    const nodesToMerge: INode[] = nodes

    for (let i = 1; i < nodesToMerge.length; i++) {
      const leftNode: INode = nodesToMerge[i - 1]
      const rightNode: INode = nodesToMerge[i]
      const mergeResult = this._mergeNodes([leftNode, rightNode])
      mergedNodes.push(...mergeResult)
    }

    return mergedNodes
  }

  clear (): void {
    this._mergePositions = []
  }
}
