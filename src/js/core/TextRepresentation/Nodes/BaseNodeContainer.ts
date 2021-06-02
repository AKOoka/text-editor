import { INode, INodeCopy } from './INode'
import { TextStyleType } from '../../../common/TextStyleType'
import { NodeRepresentation } from '../NodeRepresentation'
import { RangeNode } from './RangeNode'
import { PositionNode } from './PositionNode'
import { NodeUpdatesManager, TextEditorRepresentationUpdateNodeType } from '../NodeUpdatesManager'
import { NodeCreator } from './NodeCreator'
import { NodeMerger } from './NodeMerger'

export type ChildNodeInRangeCallback<TextStyle> = (
  rangeNode: RangeNode,
  childNode: INode,
  textStyleType: TextStyle,
  nodeUpdatesManager: NodeUpdatesManager
) => INode[]

abstract class BaseNodeContainer implements INode {
  protected _childNodes: INode[]
  protected _size: number
  protected _representation: NodeRepresentation
  protected _nodeCreator: NodeCreator
  protected _nodeMerger: NodeMerger

  protected constructor (childNodes: INode[]) {
    this._childNodes = childNodes
    this._size = 0
    this._representation = new NodeRepresentation()
    this._nodeCreator = new NodeCreator()

    for (const childNode of this._childNodes) {
      this._size += childNode.getSize()
    }
  }

  protected _updateChildNodesInRange<TextStyle> (
    inRangeCallback: ChildNodeInRangeCallback<TextStyle>,
    rangeNode: RangeNode,
    textStyleType: TextStyle,
    nodeUpdatesManager: NodeUpdatesManager
  ): INode[] {
    let newChildNodes: INode[] = []
    let childStartOffset: number = rangeNode.offset

    for (const childNode of this._childNodes) {
      const childNodeSize: number = childNode.getSize()

      if (rangeNode.childNodeInRange(childStartOffset, childNodeSize)) {
        const changedNodes = inRangeCallback(new RangeNode(childStartOffset, rangeNode.initStart, rangeNode.initEnd), childNode, textStyleType, nodeUpdatesManager)
        newChildNodes = newChildNodes.concat(changedNodes)
        this._nodeMerger.addSecondMergeNode(changedNodes[0])
        this._nodeMerger.addFirstMergeNode(newChildNodes.length - 1, newChildNodes[newChildNodes.length - 1])
      } else {
        newChildNodes.push(childNode)
        this._nodeMerger.addSecondMergeNode(childNode)
      }

      childStartOffset += childNodeSize
    }

    return newChildNodes
  }

  getSize (): number {
    return this._size
  }

  deleteText (range: RangeNode, nodeUpdatesManager: NodeUpdatesManager): boolean {
    const newChildNodes: INode[] = []
    let startOffset: number = range.offset

    if (range.nodeInsideRange(this.getSize())) {
      nodeUpdatesManager.addNodeUpdate(TextEditorRepresentationUpdateNodeType.DELETE)
      nodeUpdatesManager.endPath()
      return true
    }

    for (let i = 0; i < this._childNodes.length; i++) {
      const curChildSize = this._childNodes[i].getSize()

      if (range.childNodeInRange(startOffset, curChildSize)) {
        nodeUpdatesManager.addPath(i)

        const emptyChild: boolean = this._childNodes[i].deleteText(new RangeNode(startOffset, range.initStart, range.initEnd), nodeUpdatesManager)
        this._size -= curChildSize - this._childNodes[i].getSize()
        if (emptyChild) {
          this._nodeMerger.addFirstMergeNode(newChildNodes.length - 1, newChildNodes[newChildNodes.length - 1])
        } else {
          newChildNodes.push(this._childNodes[i])
          this._nodeMerger.addSecondMergeNode(newChildNodes[newChildNodes.length - 1])
        }
      } else {
        newChildNodes.push(this._childNodes[i])
      }

      startOffset += curChildSize
    }

    for (const { mergePosition, mergedNodes } of this._nodeMerger.mergeResults) {
      newChildNodes.splice(mergePosition, 2, ...mergedNodes)
    }

    this._childNodes = newChildNodes
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

  addContent (position: PositionNode, content: INodeCopy[], parentTextStyles: TextStyleType[], nodeUpdateManger: NodeUpdatesManager): INode[] {
    let startOffset: number = position.offset
    for (let i = 0; i < this._childNodes.length; i++) {
      const childSize: number = this._childNodes[i].getSize()
      if (position.nodeInPosition(startOffset, this._childNodes[i].getSize())) {
        nodeUpdateManger.addPath(i)
        this._childNodes.splice(
          i,
          1,
          ...this._childNodes[i].addContent(
            new PositionNode(startOffset, position.initPosition),
            content,
            parentTextStyles,
            nodeUpdateManger
          )
        )
        this._nodeMerger.addFirstMergeNode(i - 1, this._childNodes[i - 1])
        this._nodeMerger.addSecondMergeNode(this._childNodes[i])
        for (const { mergePosition, mergedNodes } of this._nodeMerger.mergeResults) {
          this._childNodes.splice(mergePosition, 2, ...mergedNodes)
        }
        return this._childNodes
      }
      startOffset += childSize
    }
    return this._childNodes
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

  abstract getTextStylesInRange (range: RangeNode): TextStyleType[]
  abstract addText (position: PositionNode, text: string, nodeUpdatesManager: NodeUpdatesManager): void
  abstract addTextStyle (range: RangeNode, textStyle: TextStyleType, nodeUpdatesManager: NodeUpdatesManager): INode[]
  abstract deleteAllTextStyles (range: RangeNode, nodeUpdatesManager: NodeUpdatesManager): INode[]
  abstract deleteConcreteTextStyle (range: RangeNode, textStyle: TextStyleType, nodeUpdatesManager: NodeUpdatesManager): INode[]
}

export { BaseNodeContainer }
