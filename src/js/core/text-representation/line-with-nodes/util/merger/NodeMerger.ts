import { TextStyle } from '../../../../../common/TextStyle'
import { Node, INodeContainer, INodeText, INodeTextStyle, NodeType } from '../../nodes/Node'
import { NodeCreator } from '../NodeCreator'
import { NodeChildren } from '../../nodes/NodeChildren'

interface IMergeResult {
  node?: Node
  success: boolean
}

export interface IMergeSuccess extends IMergeResult {
  node: Node
  success: true
}

export interface IMergeFailure extends IMergeResult {
  success: false
}

export type MergeResult = IMergeSuccess | IMergeFailure

export class NodeMerger {
  private readonly _nodeCreator: NodeCreator

  constructor (nodeCreator: NodeCreator) {
    this._nodeCreator = nodeCreator
  }

  mergeTwoNodeText (leftNode: INodeText, rightNode: INodeText): INodeText {
    leftNode.text += rightNode.text
    return leftNode
  }

  mergeTwoNodeTextStyle (leftNode: INodeTextStyle, rightNode: INodeTextStyle): INodeTextStyle {
    return this._nodeCreator.createNodeTextStyle(
      leftNode.text + rightNode.text,
      leftNode.style
    )
  }

  private _mergeNodeLayers (leftNodeLayer: NodeChildren, rightNodeLayer: NodeChildren): NodeChildren {
    const mergeResult: MergeResult = this.mergeIfPossibleTwoNodes(
      leftNodeLayer.lastNode.node,
      rightNodeLayer.firstNode.node
    )

    if (mergeResult.success) {
      leftNodeLayer.lastNode.node = mergeResult.node
      rightNodeLayer.shift()
    }

    leftNodeLayer.mergeWithNodeLayer(rightNodeLayer)

    return leftNodeLayer
  }

  mergeTwoNodeContainer (leftNode: INodeContainer, rightNode: INodeContainer): INodeContainer {
    this._mergeNodeLayers(leftNode.childNodes, rightNode.childNodes)
    return leftNode
  }

  mergeNodeTextWithNodeTextContent (nodeText: INodeText, text: string, mergeAfter: boolean): INodeText {
    const newNodeText: INodeText = this._nodeCreator.createNodeText(nodeText.text)

    if (mergeAfter) {
      newNodeText.text += text
    } else {
      newNodeText.text = text + nodeText.text
    }

    return newNodeText
  }

  mergeNodeTextStyleWithNodeTextContent (nodeTextStyle: INodeTextStyle, text: string, mergeAfter: boolean): INodeTextStyle {
    if (mergeAfter) {
      return this._nodeCreator.createNodeTextStyle(nodeTextStyle.text + text, nodeTextStyle.style)
    } else {
      return this._nodeCreator.createNodeTextStyle(text + nodeTextStyle.text, nodeTextStyle.style)
    }
  }

  mergeNodeContainerWithNodeTextContent (nodeContainer: INodeContainer, text: string, mergeAfter: boolean): INodeContainer {
    const newNodeContainer: INodeContainer = this._nodeCreator.createNodeContainer(nodeContainer.style, nodeContainer.childNodes)

    if (mergeAfter) {
      const { node } = newNodeContainer.childNodes.lastNode

      if (node.type === NodeType.TEXT) {
        this.mergeNodeTextWithNodeTextContent(node, text, mergeAfter)
      } else {
        newNodeContainer.childNodes.push(this._nodeCreator.createNodeText(text))
      }
    } else {
      const { node } = newNodeContainer.childNodes.firstNode

      if (node.type === NodeType.TEXT) {
        this.mergeNodeTextWithNodeTextContent(node, text, mergeAfter)
      } else {
        newNodeContainer.childNodes.unshift(this._nodeCreator.createNodeText(text))
      }
    }

    return newNodeContainer
  }

  mergeNodeContainerWithNodeTextStyle (nodeContainer: INodeContainer, nodeTextStyle: INodeTextStyle, mergeAfter: boolean): INodeContainer {
    return this.mergeNodeContainerWithNodeTextContent(nodeContainer, nodeTextStyle.text, mergeAfter)
  }

  mergeIfPossibleNodeWithNodeTextStyleContent (node: Node, text: string, style: TextStyle, mergeAfter: boolean): MergeResult {
    if (node.type === NodeType.TEXT || !node.style.deepCompare(style)) {
      return { success: false }
    }

    switch (node.type) {
      case NodeType.TEXT_STYLE:
        return {
          node: this.mergeNodeTextStyleWithNodeTextContent(node, text, mergeAfter),
          success: true
        }
      case NodeType.CONTAINER:
        return {
          node: this.mergeNodeContainerWithNodeTextContent(node, text, mergeAfter),
          success: true
        }
    }

    throw new Error("can't merge node with NodeTextStyle")
  }

  mergeIfPossibleTwoNodes (leftNode: Node, rightNode: Node): MergeResult {
    if (leftNode.type === NodeType.TEXT) {
      if (rightNode.type === NodeType.TEXT) {
        return { success: true, node: this.mergeTwoNodeText(leftNode, rightNode) }
      }

      return { success: false }
    } else if (rightNode.type === NodeType.TEXT) {
      return { success: false }
    } else if (leftNode.style.deepCompare(rightNode.style)) {
      if (leftNode.type === NodeType.CONTAINER) {
        if (rightNode.type === NodeType.CONTAINER) {
          return { success: true, node: this.mergeTwoNodeContainer(leftNode, rightNode) }
        } else {
          return { success: true, node: this.mergeNodeContainerWithNodeTextStyle(leftNode, rightNode, true) }
        }
      } else if (rightNode.type === NodeType.CONTAINER) {
        return { success: true, node: this.mergeNodeContainerWithNodeTextStyle(rightNode, leftNode, false) }
      } else {
        return { success: true, node: this.mergeTwoNodeTextStyle(leftNode, rightNode) }
      }
    }

    return { success: false }
  }

  mergeIfPossibleNodeWithNodeContainerContent (node: Node, textStyle: TextStyle, childNodes: NodeChildren, mergeAfter: boolean): MergeResult {
    if (node.type === NodeType.TEXT || !node.style.deepCompare(textStyle)) {
      return { success: false }
    }

    switch (node.type) {
      case NodeType.CONTAINER:
        if (mergeAfter) {
          this._mergeNodeLayers(childNodes, node.childNodes)
        } else {
          this._mergeNodeLayers(node.childNodes, childNodes)
        }
        return { success: true, node }
      case NodeType.TEXT_STYLE:
        // merge with node text style
        return { success: true, node: this._nodeCreator.createNodeContainer(textStyle, childNodes) }
    }

    console.log('node', node, 'textStyle', textStyle, 'childNodes', childNodes)
    throw new Error("node container can't be merged with node")
  }
}
