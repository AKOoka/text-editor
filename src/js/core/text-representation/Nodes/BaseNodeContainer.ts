import { CreatedContent, INode, INodeCopy, NodeType } from './INode'
import { NodeRepresentation } from './NodeRepresentation'
import { PositionWithOffset } from '../line-with-nodes/util/PositionWithOffset'
import { NodeCreator } from './NodeCreator'
import { NodeMerger } from './NodeMerger'
import { TextStyle } from '../../../common/TextStyle'
import { RangeWithOffset } from '../line-with-nodes/util/RangeWithOffset'

export type ChildNodeInRangeCallback<TextStyle> = (
  range: RangeWithOffset,
  childNode: INode,
  textStyleType: TextStyle,
) => INode[]

abstract class BaseNodeContainer implements INode {
  protected _childNodes: INode[]
  protected _childStyles: Set<TextStyle>
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
    range: RangeWithOffset,
    textStyleType: TextStyle
  ): INode[] {
    let newChildNodes: INode[] = []
    let childStartOffset: number = range.offset

    for (let i = 0; i < this._childNodes.length; i++) {
      const childNode = this._childNodes[i]
      const childNodeSize: number = childNode.getSize()

      if (range.childNodeInRange(childStartOffset, childNodeSize)) {
        const changedNodes = inRangeCallback(range.copy().reset(range.start, range.end, childStartOffset), childNode, textStyleType)
        this._nodeMerger.savePositionChange(i, i + changedNodes.length - 1)
        newChildNodes = newChildNodes.concat(changedNodes)
      } else {
        newChildNodes.push(childNode)
      }

      childStartOffset += childNodeSize
    }

    newChildNodes = this._nodeMerger.mergeNodesOnSavedPositions(newChildNodes)
    this._nodeMerger.clear()

    return newChildNodes
  }

  getSize (): number {
    return this._size
  }

  addText (position: PositionWithOffset, text: string): void {
    let startOffset: number = position.offset

    for (let i = 0; i < this._childNodes.length; i++) {
      if (position.nodeInPosition(startOffset, this._childNodes[i].getSize())) {
        this._childNodes[i].addText(position.copy().reset(position.position, startOffset), text)
        this._size += text.length
        return
      }
      startOffset += this._childNodes[i].getSize()
    }

    throw new Error("can't add text to node container")
  }

  deleteText (range: RangeWithOffset): boolean {
    const newChildNodes: INode[] = []
    let startOffset: number = range.offset

    for (let i = 0; i < this._childNodes.length; i++) {
      const childNode: INode = this._childNodes[i]
      const curChildSize = this._childNodes[i].getSize()

      if (range.childNodeInRange(startOffset, curChildSize)) {
        const emptyChild: boolean = childNode.deleteText(new RangeWithOffset(range.start, range.end, startOffset))
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

    this._childNodes = this._nodeMerger.mergeNodesOnSavedPositions(newChildNodes)
    this._nodeMerger.clear()

    return false
  }

  getContent (): INodeCopy[] {
    return this._childNodes.reduce<INodeCopy[]>((p, c) => p.concat(c.getContent()), [])
  }

  getContentInRange (range: RangeWithOffset): INodeCopy[] {
    if (range.isNodeInsideRange(this.getSize())) {
      return this.getContent()
    }

    const content: INodeCopy[] = []
    let nodeOffset: number = range.offset
    for (const childNode of this._childNodes) {
      if (range.childNodeInRange(range.start, range.end)) {
        content.push(...childNode.getContentInRange(new RangeWithOffset(nodeOffset, range.start, range.end)))
      }
      nodeOffset += childNode.getSize()
    }
    return content
  }

  addContent (position: PositionWithOffset, content: INodeCopy[], parentTextStyles: TextStyle[]): CreatedContent {
    let startOffset: number = position.offset
    for (let i = 0; i < this._childNodes.length; i++) {
      const childNode = this._childNodes[i]
      const childNodeSize: number = childNode.getSize()
      if (position.nodeInPosition(startOffset, this._childNodes[i].getSize())) {
        const { nodes, nodeStyles } = this._childNodes[i].addContent(
          position.copy().reset(startOffset, position.position),
          content,
          parentTextStyles
        )
        for (const style of nodeStyles) {
          this._childStyles.add(style)
        }
        for (const node of nodes) {
          this._size += node.getSize()
        }
        this._nodeMerger.savePositionAdd(i, i + nodes.length - 1)
        this._childNodes.splice(i, 1, ...nodes)

        break
      }
      startOffset += childNodeSize
    }

    this._childNodes = this._nodeMerger.mergeNodesOnSavedPositions(this._childNodes)
    return { nodes: [this], nodeStyles: [...this._childStyles.values()] }
  }

  getRepresentation (): NodeRepresentation {
    const childRepresentations: NodeRepresentation[] = []
    let size: number = 0

    this._representation.clearInstructions()

    for (const child of this._childNodes) {
      childRepresentations.push(child.getRepresentation())
      size += child.getSize()
    }

    this._representation.size = size
    this._representation.addContainerInstruction(childRepresentations)

    return this._representation
  }

  abstract getNodeType (): NodeType
  abstract getStyle (): TextStyle | null
  abstract getTextStylesInRange (range: RangeWithOffset): TextStyle[]
  abstract addTextStyle (range: RangeWithOffset, textStyle: TextStyle): INode[]
  abstract deleteTextStyleAll (range: RangeWithOffset): INode[]
  abstract deleteTextStyleConcrete (range: RangeWithOffset, textStyle: TextStyle): INode[]
}

export { BaseNodeContainer }
