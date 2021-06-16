import { INode, NodeType } from './INode'
import { NodeText } from './NodeText'
import { NodeTextStyle } from './NodeTextStyle'
import { NodeContainerStyle } from './NodeContainerStyle'
import { BaseNode } from './BaseNode'
import { BaseNodeContainer } from './BaseNodeContainer'

type MergingNodes = [INode, INode]

type MergeFunction = (mergingNodes: MergingNodes) => INode[]

export class NodeMerger {
  private readonly _mergePositions: Set<number>
  private readonly _mergeFunctions: Record<NodeType, MergeFunction>

  constructor () {
    this._mergePositions = new Set()
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

  private _mergeTextStyleNodes (mergingNodes: [NodeTextStyle, NodeTextStyle | NodeContainerStyle]): INode[] {
    const [leftNode, rightNode] = mergingNodes
    if (rightNode instanceof NodeContainerStyle) {
      const newChildNodes = [new NodeText(leftNode.getText()), ...rightNode.getChildNodes()]
      newChildNodes.splice(0, 2, ...this._mergeNodes([newChildNodes[0], newChildNodes[1]]))
      return [new NodeContainerStyle(newChildNodes, leftNode.getStyle())]
    }
    return [new NodeTextStyle(leftNode.getText() + rightNode.getText(), leftNode.getStyle())]
  }

  private _mergeContainerStyles (mergingNodes: [NodeContainerStyle, NodeTextStyle | NodeContainerStyle]): INode[] {
    const [leftCopy, rightCopy] = mergingNodes
    const newChildNodes = leftCopy.getChildNodes()
    const leftCopySize = leftCopy.getChildNodes().length - 1
    if (rightCopy instanceof BaseNode) {
      newChildNodes.push(new NodeText(rightCopy.getText()))
    } else if (rightCopy instanceof NodeContainerStyle) {
      newChildNodes.push(...rightCopy.getChildNodes())
    }
    newChildNodes.splice(leftCopySize, 2, ...this._mergeNodes([newChildNodes[leftCopySize], newChildNodes[leftCopySize + 1]]))
    return [new NodeContainerStyle(newChildNodes, leftCopy.getStyle())]
  }

  private _mergeNodes (mergingNodes: [INode, INode]): INode[] {
    const [leftNode, rightNode] = mergingNodes

    // if (leftNode.getStyle()?.compare(rightNode.getStyle()))
    if (leftNode.getStyle() === rightNode.getStyle()) {
      // if (rightNode.getNodeType() === NodeType.CONTAINER_STYLE) {
      //   return this._mergeFunctions[leftNode.getNodeType()]([rightNode, leftNode])
      // }
      return this._mergeFunctions[leftNode.getNodeType()](mergingNodes)
    } else {
      return mergingNodes
    }
  }

  private _isValidPosition (position: number): boolean {
    return position !== 0 && this._mergePositions.has(position)
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
      this._mergePositions.add(position - 1)
      this._mergePositions.add(position)
    }
  }

  savePositionChange (changeStart: number, changeEnd: number): void {
    const mergePositions: number[] = []
    if (this._isValidPosition(changeStart)) {
      mergePositions.push(changeStart - 1, changeStart)
    }
    if (this._isValidPosition(changeEnd)) {
      mergePositions.push(changeEnd, changeEnd + 1)
    }

    for (const p of mergePositions) {
      this._mergePositions.add(p)
    }
  }

  savePositionAdd (addStart: number, addEnd: number): void {
    const mergePositions: number[] = []
    if (this._isValidPosition(addStart)) {
      mergePositions.push(addStart - 1, addStart)
    }
    if (this._isValidPosition(addEnd)) {
      mergePositions.push(addEnd, addEnd + 1)
    }

    for (const p of mergePositions) {
      this._mergePositions.add(p)
    }
  }

  mergeNodesOnSavedPositions (nodes: INode[]): INode[] {
    if (this._mergePositions.size <= 1) {
      return nodes
    }

    const mergedNodes: INode[] = [...nodes]
    /* const mergePositions = [...this._mergePositions.values()]

    for (let i = 0; i < mergePositions.length; i++) {
      const leftNode: INode = mergedNodes[mergePositions[i]]
      const rightNode: INode = mergedNodes[mergePositions[i + 1]]
      const mergeResult = this._mergeNodes([leftNode, rightNode])
      mergedNodes.splice(mergePositions[i], 2, ...mergeResult)

      if (mergeResult.length === 1) {
        i--
      }
    } */

    // for (let i = 1; i < nodes.length; i++) {
    //   const leftNode: INode = nodes[i - 1]
    //   const rightNode: INode = nodes[i]
    //   const mergeResult = this._mergeNodes([leftNode, rightNode])
    //   mergedNodes.splice(i - 1, 2, ...mergeResult)
    // }

    return mergedNodes
  }

  clear (): void {
    this._mergePositions.clear()
  }
}
