import { Range } from '../../common/Range'
import { ITextRepresentationSubscriber } from '../../common/ITextRepresentationSubscriber'
import { INodeCopy } from './Nodes/INode'
import { TextStyleType } from '../../common/TextStyleType'
import { NodeContainerLine } from './Nodes/NodeContainerLine'
import { ISelection } from '../../common/ISelection'
import { IPoint } from '../../common/IPoint'
import { PositionNode } from './Nodes/PositionNode'
import { RangeNode } from './Nodes/RangeNode'
import {
  ITextEditorRepresentationUpdateLine,
  TextEditorRepresentationUpdateLineType,
  TextEditorRepresentationUpdateManager
} from './TextEditorRepresentationUpdateManager'
import { ITextEditorRepresentationLine } from './ITextEditorRepresentationLine'

interface ILineTextOffset {
  offsetPosition: number
  offset: number
}

type ChangeCallback = (payload: IChangeCallbackPayload) => void
type GetInfoCallback<Info> = (payload: IGetInfoCallbackPayload) => Info[]

interface IChangeCallbackPayload {
  line: ITextEditorRepresentationLine
  rangeNode: RangeNode
}

interface IGetInfoCallbackPayload {
  line: ITextEditorRepresentationLine
  rangeNode: RangeNode
}

class TextEditorRepresentation {
  private readonly _subscribers: ITextRepresentationSubscriber[]
  private _textLines: ITextEditorRepresentationLine[]
  private _linePositionOffset: Map<number, number>
  private _lineTextOffset: Map<number, ILineTextOffset[]>
  private _updateManager: TextEditorRepresentationUpdateManager

  constructor () {
    this._textLines = []
    this._subscribers = []
    this._linePositionOffset = new Map()
    this._lineTextOffset = new Map()
    this._updateManager = new TextEditorRepresentationUpdateManager()
  }

  private _reset (): void {
    this._linePositionOffset = new Map()
    this._lineTextOffset = new Map()
    this._updateManager = new TextEditorRepresentationUpdateManager()
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
      this._updateManager.addUpdateLineChange(rangeY.start, lineOffset)

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
        this._updateManager.addUpdateLineChange(i, lineOffset)
      }

      lineOffset = this._getOffsetY(rangeY.end)
      line = this._textLines[rangeY.end + lineOffset]
      changeCallback({ line, rangeNode: new RangeNode(0, 0, rangeX.end + this._getOffsetX(rangeY.end, rangeX.end)) })
      this._updateManager.addUpdateLineChange(rangeY.end, lineOffset)
    }
  }

  private _getInfoInSelections<Info> (selections: ISelection[], getInfoCallback: GetInfoCallback<Info>): Info[] {
    const info: Info[] = []

    for (const { rangeX, rangeY } of selections) {
      let line: ITextEditorRepresentationLine = this._textLines[rangeY.start + this._getOffsetY(rangeY.start)]
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
    const newLines: ITextEditorRepresentationLine[] = []
    const offsetY: number = this._getOffsetY(rangeY.start)
    const insertPosition: number = rangeY.start + offsetY

    this._setOffsetY(rangeY.start + rangeY.width + 1, rangeY.width)

    for (let i = 0; i < rangeY.width; i++) {
      newLines.push(new NodeContainerLine())
      this._updateManager.addUpdateLineAdd(insertPosition + i, offsetY)
    }

    this._textLines = this._textLines
      .slice(0, insertPosition)
      .concat(newLines, this._textLines.slice(insertPosition))
  }

  deleteLines (rangeY: Range): void {
    const lineOffset = this._getOffsetY(rangeY.start)
    const deletedLines = this._textLines.splice(rangeY.start + lineOffset, rangeY.width)
    this._setOffsetY(rangeY.start - rangeY.width - 1, -rangeY.width)
    for (let i = 0; i < deletedLines.length; i++) {
      this._updateManager.addUpdateLineDelete(rangeY.start + i, lineOffset)
    }
  }

  addTextInLine (point: IPoint, text: string): void {
    const lineOffset = this._getOffsetY(point.y)
    const line = this._textLines[point.y + lineOffset]
    line.addText(new PositionNode(0, point.x + this._getOffsetX(point.y, point.x)), text)
    this._setOffsetX(point.y, point.x, text.length)
    this._updateManager.addUpdateLineChange(point.y, lineOffset)
  }

  deleteTextInLine (y: number, rangeX: Range): void {
    const offsetY: number = this._getOffsetY(y)
    const lineY = y + offsetY
    const line: ITextEditorRepresentationLine = this._textLines[lineY]

    line.deleteText(
      new RangeNode(
        0,
        rangeX.start + this._getOffsetX(y, rangeX.start),
        rangeX.end + this._getOffsetX(y, rangeX.end)
      )
    )
    this._setOffsetX(y, rangeX.start, rangeX.width)
    this._updateManager.addUpdateLineChange(y, offsetY)
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

  getContentInSelections (selections: ISelection[]): INodeCopy[] {
    return this._getInfoInSelections<INodeCopy>(
      selections,
      ({ line, rangeNode }) => line.getContentInRange(rangeNode))
  }

  addContent (point: IPoint, content: INodeCopy[]): void {
    const lineOffset = this._getOffsetY(point.y)
    const line = this._textLines[point.y + lineOffset]
    line.addContent(new PositionNode(0, point.x + this._getOffsetX(point.y, point.x)), content)
    this._setOffsetX(
      point.y,
      point.x,
      content.reduce((previousValue, currentValue) => previousValue + currentValue.size, 0)
    )
    this._updateManager.addUpdateLineChange(point.y, lineOffset)
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
    const updates: ITextEditorRepresentationUpdateLine[] = []
    for (const { y, type } of this._updateManager.getUpdates()) {
      switch (type) {
        case TextEditorRepresentationUpdateLineType.ADD:
          updates.push({ y, type, nodeLineRepresentation: this._textLines[y].getRepresentation() })
          break
        case TextEditorRepresentationUpdateLineType.CHANGE:
          updates.push({ y, type, nodeLineRepresentation: this._textLines[y].getRepresentation() })
          break
        case TextEditorRepresentationUpdateLineType.DELETE:
          updates.push({ y, type })
      }
    }
    for (const sub of this._subscribers) {
      sub.updateTextRepresentation(updates)
    }

    this._reset()
  }
}

export { TextEditorRepresentation }
