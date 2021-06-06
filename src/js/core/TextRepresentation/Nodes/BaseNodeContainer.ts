import { INode, INodeCopy } from './INode'
import { TextStyleType } from '../../../common/TextStyleType'
import { NodeRepresentation } from './NodeRepresentation'
import { RangeNode } from './RangeNode'
import { PositionNode } from './PositionNode'
import { NodeUpdatesManager } from './NodeUpdatesManager'
import { NodeCreator } from './NodeCreator'
import { NodeMerger } from './NodeMerger'
import { NodeType } from './NodeType'
import { CreatedContent } from './CreatedContent'

export type ChildNodeInRangeCallback<TextStyle> = (
  rangeNode: RangeNode,
  childNode: INode,
  textStyleType: TextStyle,
  nodeUpdatesManager: NodeUpdatesManager
) => INode[]

abstract class BaseNodeContainer implements INode {
  protected _childNodes: INode[]
  protected _childStyles: Set<TextStyleType>
  protected _size: number
  protected _representation: NodeRepresentation
  protected _nodeCreator: NodeCreator
  protected _nodeMerger: NodeMerger

  protected constructor (childNodes: INode[]) {
    this._childNodes = childNodes
    this._childStyles = new Set()
    this._size = 0
    this._representation = new NodeRepresentation()
    this._nodeCreator = new NodeCreator()
    this._nodeMerger = new NodeMerger()

    for (const childNode of this._childNodes) {
      this._size += childNode.getSize()
      const childStyle = childNode.getStyle()
      if (childStyle !== null) {
        this._childStyles.add(childStyle)
      }
    }
  }

  getChildNodes (): INode[] {
    return this._childNodes
  }

  protected _updateChildNodesInRange<TextStyle> (
    inRangeCallback: ChildNodeInRangeCallback<TextStyle>,
    rangeNode: RangeNode,
    textStyleType: TextStyle,
    nodeUpdatesManager: NodeUpdatesManager
  ): INode[] {
    let newChildNodes: INode[] = []
    let childStartOffset: number = rangeNode.offset

    for (let i = 0; i < this._childNodes.length; i++) {
      const childNode = this._childNodes[i]
      const childNodeSize: number = childNode.getSize()

      if (rangeNode.childNodeInRange(childStartOffset, childNodeSize)) {
        nodeUpdatesManager.addPath(i)
        const changedNodes = inRangeCallback(rangeNode.reset(childStartOffset, rangeNode.initStart, rangeNode.initEnd), childNode, textStyleType, nodeUpdatesManager)
        this._nodeMerger.savePositionChange(i, i + changedNodes.length - 1)
        newChildNodes = newChildNodes.concat(changedNodes)
      } else {
        newChildNodes.push(childNode)
      }

      childStartOffset += childNodeSize
    }

    newChildNodes = this._nodeMerger.mergeNodesOnSavedPositions(newChildNodes, nodeUpdatesManager)
    this._nodeMerger.clear()
    nodeUpdatesManager.endPath()

    return newChildNodes
  }

  getSize (): number {
    return this._size
  }

  addText (position: PositionNode, text: string, nodeUpdateManager: NodeUpdatesManager): void {
    let startOffset: number = position.offset

    for (let i = 0; i < this._childNodes.length; i++) {
      if (position.nodeInPosition(startOffset, this._childNodes[i].getSize())) {
        nodeUpdateManager.addPath(i)
        this._childNodes[i].addText(position.reset(startOffset, position.initPosition), text, nodeUpdateManager)
        this._size += text.length
        nodeUpdateManager.endPath()
        return
      }
      startOffset += this._childNodes[i].getSize()
    }

    throw new Error("can't add text to node container")
  }

  deleteText (range: RangeNode, nodeUpdatesManager: NodeUpdatesManager): boolean {
    const newChildNodes: INode[] = []
    let startOffset: number = range.offset

    for (let i = 0; i < this._childNodes.length; i++) {
      const childNode: INode = this._childNodes[i]
      const curChildSize = this._childNodes[i].getSize()

      if (range.childNodeInRange(startOffset, curChildSize)) {
        nodeUpdatesManager.addPath(i)
        const emptyChild: boolean = childNode.deleteText(new RangeNode(startOffset, range.initStart, range.initEnd), nodeUpdatesManager)
        this._size -= curChildSize - childNode.getSize()
        if (emptyChild) {
          this._nodeMerger.savePositionDelete(i)
        } else {
          newChildNodes.push(childNode)
        }
      } else {
        newChildNodes.push(childNode)
      }

      startOffset += curChildSize
    }

    this._childNodes = this._nodeMerger.mergeNodesOnSavedPositions(newChildNodes, nodeUpdatesManager)
    this._nodeMerger.clear()
    nodeUpdatesManager.endPath()

    return false
  }

  getContent (): INodeCopy[] {
    return this._childNodes.reduce<INodeCopy[]>((p, c) => p.concat(c.getContent()), [])
  }

  getContentInRange (range: RangeNode): INodeCopy[] {
    if (range.nodeInsideRange(this.getSize())) {
      return this.getContent()
    }

    const content: INodeCopy[] = []
    let nodeOffset: number = range.offset
    for (const childNode of this._childNodes) {
      if (range.childNodeInRange(range.start, range.end)) {
        content.push(...childNode.getContentInRange(new RangeNode(nodeOffset, range.initStart, range.initEnd)))
      }
      nodeOffset += childNode.getSize()
    }
    return content
  }

  addContent (position: PositionNode, content: INodeCopy[], parentTextStyles: TextStyleType[], nodeUpdateManger: NodeUpdatesManager): CreatedContent {
    let startOffset: number = position.offset
    for (let i = 0; i < this._childNodes.length; i++) {
      const childNode = this._childNodes[i]
      const childNodeSize: number = childNode.getSize()
      if (position.nodeInPosition(startOffset, this._childNodes[i].getSize())) {
        nodeUpdateManger.addPath(i)
        const { nodes, nodeStyles } = this._childNodes[i].addContent(
          position.reset(startOffset, position.initPosition),
          content,
          parentTextStyles,
          nodeUpdateManger
        )
        for (const style of nodeStyles) {
          this._childStyles.add(style)
        }
        this._nodeMerger.savePositionAdd(i, i + nodes.length - 1)
        this._childNodes.splice(i, 1, ...nodes)

        break
      }
      startOffset += childNodeSize
    }

    this._childNodes = this._nodeMerger.mergeNodesOnSavedPositions(this._childNodes, nodeUpdateManger)
    return { nodes: [this], nodeStyles: [...this._childStyles.values()] }
  }

  getRepresentation (): NodeRepresentation {
    const representation: NodeRepresentation = new NodeRepresentation()
    const childRepresentations: NodeRepresentation[] = []
    let size: number = 0

    for (const child of this._childNodes) {
      childRepresentations.push(child.getRepresentation())
      size += child.getSize()
    }

    representation.size = size
    representation.addContainerInstruction(childRepresentations)

    return representation
  }

  abstract getNodeType (): NodeType
  abstract getStyle (): TextStyleType | null
  abstract getTextStylesInRange (range: RangeNode): TextStyleType[]
  abstract addTextStyle (range: RangeNode, textStyle: TextStyleType, nodeUpdatesManager: NodeUpdatesManager): INode[]
  abstract deleteAllTextStyles (range: RangeNode, nodeUpdatesManager: NodeUpdatesManager): INode[]
  abstract deleteConcreteTextStyle (range: RangeNode, textStyle: TextStyleType, nodeUpdatesManager: NodeUpdatesManager): INode[]
}

export { BaseNodeContainer }
