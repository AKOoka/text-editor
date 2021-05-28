import { Range } from '../../common/Range'
import { ITextRepresentationSubscriber } from '../../common/ITextRepresentationSubscriber'
import { INode } from './Nodes/INode'
import { TextStyleType } from '../../common/TextStyleType'
import { TextRepresentationAction } from './TextRepresentationAction'
import { NodeLineContainer } from './Nodes/NodeLineContainer'
import { TextRepresentationChange } from './TextRepresentationChange'
import { NodeRepresentation } from './NodeRepresentation'
import { ISelection } from '../../common/ISelection'
import { IPoint } from '../../common/IPoint'
import { PositionNode } from './Nodes/PositionNode'
import { RangeNode } from './Nodes/RangeNode'

interface ILineTextOffset {
  offsetPosition: number
  offset: number
}

type ChangeCallback = (payload: ICallbackPayload) => void
type GetInfoCallback<Info> = (payload: ICallbackPayload) => Info[]

interface ICallbackPayload {
  line: INode
  rangeNode: RangeNode
}

class TextRepresentation {
  private readonly _subscribers: ITextRepresentationSubscriber[]
  private _textLines: INode[]
  private _linePositionOffset: Map<number, number>
  private _lineTextOffset: Map<number, ILineTextOffset[]>
  private _changes: Map<INode, [number, TextRepresentationAction]>

  constructor () {
    this._textLines = []
    this._subscribers = []
    this._linePositionOffset = new Map()
    this._lineTextOffset = new Map()
    this._changes = new Map()
  }

  private _reset (): void {
    this._linePositionOffset = new Map()
    this._lineTextOffset = new Map()
    this._changes = new Map()
  }

  private _getOffsetY (y: number): number {
    let offsetY: number = 0
    for (const [lineY, offset] of this._linePositionOffset.entries()) {
      if (lineY <= y) {
        offsetY += offset
      }
    }
    return offsetY
  }

  private _setOffsetY (y: number, offset: number): void {
    const oldOffset = this._linePositionOffset.get(y)
    if (oldOffset === undefined) {
      this._linePositionOffset.set(y, offset)
      return
    }
    this._linePositionOffset.set(y, oldOffset + offset)
  }

  private _getOffsetX (y: number, x: number): number {
    const line = this._lineTextOffset.get(y)
    if (line === undefined) {
      return 0
    }

    let offsetX: number = 0
    for (const { offsetPosition, offset } of line.values()) {
      if (offsetPosition <= x) {
        offsetX += offset
      }
    }
    return offsetX
  }

  private _setOffsetX (y: number, x: number, offset: number): void {
    const line = this._lineTextOffset.get(y)
    if (line === undefined) {
      this._lineTextOffset.set(y, [{ offsetPosition: x, offset }])
      return
    }
    line.push({ offsetPosition: x, offset })
  }

  private _makeChangesInSelections (selections: ISelection[], changeCallback: ChangeCallback): void {
    for (const { rangeX, rangeY } of selections) {
      let lineOffset = this._getOffsetY(rangeY.start)
      let line = this._textLines[rangeY.start + lineOffset]
      this._changes.set(line, [lineOffset + rangeY.start, TextRepresentationAction.CHANGE])

      if (rangeY.width === 0) {
        changeCallback({
          line,
          rangeNode: new RangeNode(
            0,
            rangeX.start + this._getOffsetX(rangeY.start, rangeX.start),
            rangeX.end + this._getOffsetX(rangeY.end, rangeX.end)
          )
        })
        continue
      }

      const lineStart: number = rangeX.start + this._getOffsetX(rangeY.start, rangeX.start)
      changeCallback({ line, rangeNode: new RangeNode(0, lineStart, lineStart + line.getSize()) })

      for (let i = rangeY.start + 1; i < rangeY.end; i++) {
        lineOffset = this._getOffsetY(i)
        line = this._textLines[i + lineOffset]
        changeCallback({ line, rangeNode: new RangeNode(0, 0, line.getSize()) })
        this._changes.set(line, [lineOffset + i, TextRepresentationAction.CHANGE])
      }

      lineOffset = this._getOffsetY(rangeY.end)
      line = this._textLines[rangeY.end + lineOffset]
      changeCallback({ line, rangeNode: new RangeNode(0, 0, rangeX.end + this._getOffsetX(rangeY.end, rangeX.end)) })
      this._changes.set(line, [lineOffset + rangeY.end, TextRepresentationAction.CHANGE])
    }
  }

  private _getInfoInSelections<Info> (selections: ISelection[], getInfoCallback: GetInfoCallback<Info>): Info[] {
    const info: Info[] = []

    for (const { rangeX, rangeY } of selections) {
      let line: INode = this._textLines[rangeY.start + this._getOffsetY(rangeY.start)]
      if (rangeY.width === 0) {
        info.push(...getInfoCallback({
          line,
          rangeNode: new RangeNode(
            0,
            rangeX.start + this._getOffsetX(rangeY.start, rangeX.start),
            rangeX.end + this._getOffsetX(rangeY.end, rangeX.end)
          )
        }))
        continue
      }

      const lineStart: number = rangeX.start + this._getOffsetX(rangeY.start, rangeX.start)
      info.push(...getInfoCallback({ line, rangeNode: new RangeNode(0, lineStart, lineStart + line.getSize()) }))
      for (let i = rangeY.start + 1; i < rangeY.end; i++) {
        line = this._textLines[i + this._getOffsetY(i)]
        info.push(...getInfoCallback({ line, rangeNode: new RangeNode(0, 0, line.getSize()) }))
      }
      info.push(...getInfoCallback({
        line,
        rangeNode: new RangeNode(0, 0, rangeX.end + this._getOffsetX(rangeY.end, rangeX.end))
      }))
    }

    return info
  }

  getLinesCount (): number {
    return this._textLines.length
  }

  getTextLengthInLine (y: number): number {
    return this._textLines[y].getSize()
  }

  addNewLines (rangeY: Range): void {
    const newLines: INode[] = []
    const offsetY: number = this._getOffsetY(rangeY.start)
    const insertPosition: number = rangeY.start + offsetY + 1
    for (let i = 0; i < rangeY.width; i++) {
      newLines.push(new NodeLineContainer([]))
    }
    this._textLines = this._textLines
      .slice(0, insertPosition)
      .concat(newLines, this._textLines.slice(insertPosition))

    this._setOffsetY(rangeY.start + rangeY.width + 1, rangeY.width)

    for (let i = 0; i < rangeY.width; i++) {
      this._changes.set(newLines[i], [offsetY + i + rangeY.start + i + 1, TextRepresentationAction.ADD])
    }
  }

  deleteLines (rangeY: Range): void {
    const lineOffset = this._getOffsetY(rangeY.start)
    const deletedLines = this._textLines.splice(rangeY.start + lineOffset, rangeY.width)
    this._setOffsetY(rangeY.start - rangeY.width - 1, -rangeY.width)
    for (const deletedLine of deletedLines) {
      this._changes.set(deletedLine, [lineOffset + rangeY.start, TextRepresentationAction.REMOVE])
    }
  }

  addTextInLine (point: IPoint, text: string): void {
    const lineOffset = this._getOffsetY(point.y)
    const line = this._textLines[point.y + lineOffset]
    line.addText(new PositionNode(0, point.x + this._getOffsetX(point.y, point.x)), text)
    this._setOffsetX(point.y, point.x, text.length)
    this._changes.set(line, [lineOffset + point.y, TextRepresentationAction.CHANGE])
  }

  deleteTextInLine (y: number, rangeX: Range): void {
    const offsetY: number = this._getOffsetY(y)
    const lineY = y + offsetY
    const line: INode = this._textLines[lineY]

    line.deleteText(
      new RangeNode(
        0,
        rangeX.start + this._getOffsetX(y, rangeX.start),
        rangeX.end + this._getOffsetX(y, rangeX.end)
      )
    )
    this._setOffsetX(y, rangeX.start, rangeX.width)
    this._changes.set(line, [offsetY + y, TextRepresentationAction.CHANGE])
  }

  deleteTextInSelections (selections: ISelection[]): void {
    for (const { rangeX, rangeY } of selections) {
      if (rangeY.width === 0) {
        this.deleteTextInLine(rangeY.start, rangeX)
        continue
      }

      this.deleteTextInLine(rangeY.start, new Range(rangeX.start, this._textLines[rangeY.start].getSize()))
      this.deleteTextInLine(rangeY.end, new Range(0, rangeX.end))
      this.deleteLines(rangeY)
    }
  }

  getTextStylesInSelections (selections: ISelection[]): TextStyleType[] {
    return this._getInfoInSelections(
      selections,
      ({ line, rangeNode }) => line.getTextStylesInRange(rangeNode))
  }

  getContentInSelections (selections: ISelection[]): NodeRepresentation[] {
    return this._getInfoInSelections<NodeRepresentation>(
      selections,
      ({ line, rangeNode }) => line.getContentInRange(rangeNode))
  }

  addContent (point: IPoint, content: NodeRepresentation[]): void {
    const lineOffset = this._getOffsetY(point.y)
    const line = this._textLines[point.y + lineOffset]
    line.addContent(new PositionNode(0, point.x + this._getOffsetX(point.y, point.x)), content, [])
    this._setOffsetX(
      point.y,
      point.x,
      content.reduce((previousValue, currentValue) => previousValue + currentValue.size, 0)
    )
    this._changes.set(line, [lineOffset + point.y, TextRepresentationAction.CHANGE])
  }

  addTextStylesInSelections (selections: ISelection[], textStyleType: TextStyleType): void {
    this._makeChangesInSelections(
      selections,
      ({ line, rangeNode }) => line.addTextStyle(rangeNode, textStyleType)
    )
  }

  deleteAllTextStylesInSelections (selections: ISelection[]): void {
    this._makeChangesInSelections(
      selections,
      ({ line, rangeNode }) => line.deleteAllTextStyles(rangeNode)
    )
  }

  deleteConcreteTextStyleInSelections (selections: ISelection[], textStyleType: TextStyleType): void {
    this._makeChangesInSelections(
      selections,
      ({ line, rangeNode }) => line.deleteConcreteTextStyle(rangeNode, textStyleType)
    )
  }

  subscribe (subscriber: ITextRepresentationSubscriber): void {
    this._subscribers.push(subscriber)
  }

  notifySubscribers (): void {
    const lineChanges: TextRepresentationChange[] = []

    for (const [line, [position, action]] of this._changes.entries()) {
      const textRepresentationChange = new TextRepresentationChange()
      textRepresentationChange.nodeRepresentation = line.getRepresentation()
      textRepresentationChange.position = position
      textRepresentationChange.action = action

      lineChanges.push(textRepresentationChange)
    }

    for (const sub of this._subscribers) {
      sub.updateTextRepresentation(lineChanges)
    }

    this._reset()
  }
}

export { TextRepresentation }
