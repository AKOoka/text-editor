import { IRange } from '../../common/IRange'
import { ITextRepresentationSubscriber } from '../../common/ITextRepresentationSubscriber'
import { INode } from './Nodes/INode'
import { TextStyleType } from '../../common/TextStyleType'
import { TextRepresentationAction } from './TextRepresentationAction'
import { NodeLineContainer } from './Nodes/NodeLineContainer'
import { TextRepresentationChange } from './TextRepresentationChange'
import { NodeRepresentation } from './Nodes/NodeRepresentation'

interface ILineTextOffset {
  offsetPosition: number
  offset: number
}

type ChangeCallback = (payload: ICallbackPayload) => void
type GetInfoCallback<Info> = (payload: ICallbackPayload) => Info[]

interface ICallbackPayload {
  line: INode
  offset: number
  startX: number
  endX: number
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

  private _getLinePositionOffset (linePosition: number): number {
    let lineOffset: number = 0
    for (const [linePos, offset] of this._linePositionOffset.entries()) {
      if (linePos <= linePosition) {
        lineOffset += offset
      }
    }
    return lineOffset
  }

  private _setLinePositionOffset (linePosition: number, offset: number): void {
    const oldLinePositionOffset = this._linePositionOffset.get(linePosition)
    if (oldLinePositionOffset === undefined) {
      this._linePositionOffset.set(linePosition, offset)
      return
    }
    this._linePositionOffset.set(linePosition, oldLinePositionOffset + offset)
  }

  private _getLineTextOffset (linePosition: number, position: number): number {
    const line = this._lineTextOffset.get(linePosition)
    if (line === undefined) {
      return 0
    }

    let textOffset: number = 0
    for (const { offsetPosition, offset } of line.values()) {
      if (offsetPosition <= position) {
        textOffset += offset
      }
    }
    return textOffset
  }

  private _setLineTextOffset (linePosition: number, offsetPosition: number, offset: number): void {
    const line = this._lineTextOffset.get(linePosition)
    if (line === undefined) {
      this._lineTextOffset.set(linePosition, [{ offsetPosition, offset }])
      return
    }
    line.push({ offsetPosition, offset })
  }

  private _makeChangesInRanges (ranges: IRange[], changeCallback: ChangeCallback): void {
    for (const { startX, endX, startY, endY } of ranges) {
      let lineOffset = this._getLinePositionOffset(startY)
      let line = this._textLines[startY + lineOffset]
      this._changes.set(line, [lineOffset + startY, TextRepresentationAction.CHANGE])

      if (startY === endY) {
        changeCallback({
          line,
          offset: 0,
          startX: startX + this._getLineTextOffset(startY, startX),
          endX: endX + this._getLineTextOffset(endY, endX)
        })
        continue
      }

      const lineStart: number = startX + this._getLineTextOffset(startY, startX)
      changeCallback({ line, offset: 0, startX: lineStart, endX: lineStart + line.getSize() })

      for (let i = startY + 1; i < endY; i++) {
        lineOffset = this._getLinePositionOffset(i)
        line = this._textLines[i + lineOffset]
        changeCallback({ line, offset: 0, startX: 0, endX: line.getSize() })
        this._changes.set(line, [lineOffset + i, TextRepresentationAction.CHANGE])
      }

      lineOffset = this._getLinePositionOffset(endY)
      line = this._textLines[endY + lineOffset]
      changeCallback({ line, offset: 0, startX: 0, endX: endX + this._getLineTextOffset(endY, endX) })
      this._changes.set(line, [lineOffset + endY, TextRepresentationAction.CHANGE])
    }
  }

  private _getInfoInRanges<Info> (ranges: IRange[], getInfoCallback: GetInfoCallback<Info>): Info[] {
    const info: Info[] = []

    for (const { startX, endX, startY, endY } of ranges) {
      let line: INode = this._textLines[startY + this._getLinePositionOffset(startY)]
      if (startY === endY) {
        info.push(...getInfoCallback({
          line,
          offset: 0,
          startX: startX + this._getLineTextOffset(startY, startX),
          endX: endX + this._getLineTextOffset(endY, endX)
        }))
        continue
      }

      const lineStart: number = startX + this._getLineTextOffset(startY, startX)
      info.push(...getInfoCallback({ line, offset: 0, startX: lineStart, endX: lineStart + line.getSize() }))
      for (let i = startY + 1; i < endY; i++) {
        line = this._textLines[i + this._getLinePositionOffset(i)]
        info.push(...getInfoCallback({ line, offset: 0, startX: 0, endX: line.getSize() }))
      }
      info.push(...getInfoCallback({
        line: this._textLines[endY + this._getLinePositionOffset(startY)],
        offset: 0,
        startX: 0,
        endX: endX + this._getLineTextOffset(endY, endX)
      }))
    }

    return info
  }

  getLinesCount (): number {
    return this._textLines.length
  }

  getTextLengthInLine (linePosition: number): number {
    return this._textLines[linePosition].getSize()
  }

  createNewLines (linePosition: number, count: number): void {
    const linePositionOffset: number = this._getLinePositionOffset(linePosition)
    const newLines = []
    const insertPosition: number = linePosition + linePositionOffset + 1
    for (let i = 0; i < count; i++) {
      newLines.push(new NodeLineContainer([]))
    }
    this._textLines = this._textLines
      .slice(0, insertPosition)
      .concat(newLines, this._textLines.slice(insertPosition))

    this._setLinePositionOffset(linePosition + 1, count)

    for (let i = 0; i < count; i++) {
      this._changes.set(newLines[i], [linePositionOffset + i + linePosition + i + 1, TextRepresentationAction.ADD])
    }
  }

  deleteLines (linePosition: number, count: number): void {
    const lineOffset = this._getLinePositionOffset(linePosition)
    const deletedLines = this._textLines.splice(linePosition + lineOffset, count)
    this._setLinePositionOffset(linePosition, -count)
    for (const deletedLine of deletedLines) {
      this._changes.set(deletedLine, [lineOffset + linePosition, TextRepresentationAction.REMOVE])
    }
  }

  addTextInLine (text: string, linePosition: number, textPosition: number): void {
    const lineOffset = this._getLinePositionOffset(linePosition)
    const line = this._textLines[linePosition + lineOffset]
    line.addText(text, 0, textPosition + this._getLineTextOffset(linePosition, textPosition))
    this._setLineTextOffset(linePosition, textPosition, text.length)
    this._changes.set(line, [lineOffset + linePosition, TextRepresentationAction.CHANGE])
  }

  // need to think how to make forward delete when text cursor is in the end of text line
  deleteTextInLine (linePosition: number, start: number, end: number): void {
    const linePositionOffset: number = this._getLinePositionOffset(linePosition)
    const linePos = linePosition + linePositionOffset
    const line: INode = this._textLines[linePos]

    if (line.getSize() <= 0 && this.getLinesCount() > 1) {
      this._textLines = this._textLines.slice(0, linePos).concat(this._textLines.slice(linePos + 1))
      this._setLinePositionOffset(linePosition, -1)
      this._changes.set(line, [linePositionOffset + linePosition, TextRepresentationAction.REMOVE])
      return
    }

    const endPosition: number = end === undefined ? line.getSize() : end

    line.removeText(
      0,
      start + this._getLineTextOffset(linePosition, start),
      endPosition + this._getLineTextOffset(linePosition, endPosition)
    )
    this._setLineTextOffset(linePosition, start, endPosition - start)
    this._changes.set(line, [linePositionOffset + linePosition, TextRepresentationAction.CHANGE])
  }

  deleteTextInRanges (textCursorPositions: IRange[]): void {
    for (const { startX, endX, startY, endY } of textCursorPositions) {
      if (startY === endY) {
        this.deleteTextInLine(startY, startX, endX)
        continue
      }

      this.deleteTextInLine(startY, startX, this._textLines[startY].getSize())
      this.deleteTextInLine(endY, 0, endX)
      this.deleteLines(startY + 1, endY - startY - 1)
    }
  }

  getTextStylesInRanges (textCursorPositions: IRange[]): TextStyleType[] {
    return this._getInfoInRanges(textCursorPositions, ({ line, offset, startX, endX }) => {
      return line.textStylesInRange(offset, startX, endX)
    })
  }

  getContentInRanges (ranges: IRange[]): NodeRepresentation[] {
    return this._getInfoInRanges<NodeRepresentation>(ranges, ({ line, offset, startX, endX }) => {
      return [line.getContentInRange(offset, startX, endX)]
    })
  }

  pasteContent (content: NodeRepresentation[], x: number, y: number): void {
    const lineOffset = this._getLinePositionOffset(y)
    const line = this._textLines[y + lineOffset]
    let contentSize: number = 0
    for (const c of content) {
      contentSize += c.size
    }
    line.addContent(content, 0, x + this._getLineTextOffset(y, x), [])
    this._setLineTextOffset(y, x, contentSize)
    this._changes.set(line, [lineOffset + y, TextRepresentationAction.CHANGE])
  }

  addTextStylesInRanges (textStyleType: TextStyleType, textCursorPositions: IRange[]): void {
    this._makeChangesInRanges(
      textCursorPositions,
      ({ line, offset, startX, endX }) => {
        line.addTextStyle(offset, startX, endX, textStyleType)
      }
    )
  }

  removeAllTextStylesInRanges (textCursorPositions: IRange[]): void {
    this._makeChangesInRanges(
      textCursorPositions,
      ({ line, offset, startX, endX }) => {
        line.removeAllTextStyles(offset, startX, endX)
      }
    )
  }

  removeConcreteTextStyleInRanges (textStyleType: TextStyleType, textCursorPositions: IRange[]): void {
    this._makeChangesInRanges(
      textCursorPositions,
      ({ line, offset, startX, endX }) => {
        line.removeConcreteTextStyle(offset, startX, endX, textStyleType)
      }
    )
  }

  subscribe (subscriber: ITextRepresentationSubscriber): void {
    this._subscribers.push(subscriber)
  }

  notifySubscribers (): void {
    const lineChanges: TextRepresentationChange[] = []

    for (const [line, [position, action]] of this._changes.entries()) {
      lineChanges.push(
        new TextRepresentationChange()
          .setNodeRepresentation(line.getRepresentation())
          .setPosition(position)
          .setAction(action)
      )
    }

    for (const sub of this._subscribers) {
      sub.updateTextRepresentation(lineChanges)
    }

    this._reset()
  }
}

export { TextRepresentation }
