import { ITextRepresentation } from './ITextRepresentation'
import { IRange } from '../../common/IRange'
import { ITextRepresentationSubscriber } from '../../common/ITextRepresentationSubscriber'
import { INode } from './Nodes/INode'
import { TextStyleType } from '../../common/TextStyleType'
import { TextRepresentationAction } from './TextRepresentationAction'
import { NodeLineContainer } from './Nodes/NodeLineContainer'
import { TextRepresentationChange } from './TextRepresentationChange'

interface ILineTextOffset {
  offsetPosition: number
  offset: number
}

class TextRepresentation implements ITextRepresentation {
  private readonly _subscribers: ITextRepresentationSubscriber[]
  private _textLines: INode[]
  private _linePositionOffset: Map<number, number>
  private _lineTextOffset: Map<number, ILineTextOffset[]>
  private _changes: Map<INode, [number, TextRepresentationAction]>
  private _activeTextStyles: TextStyleType[]

  constructor () {
    this._textLines = []
    this._subscribers = []
    this._linePositionOffset = new Map()
    this._lineTextOffset = new Map()
    this._changes = new Map()
    this._activeTextStyles = []
  }

  private _reset (): void {
    this._linePositionOffset = new Map()
    this._lineTextOffset = new Map()
    this._changes = new Map()
    this._activeTextStyles = []
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
  deleteTextInLine (linePosition: number, start: number, end?: number): boolean {
    const linePositionOffset: number = this._getLinePositionOffset(linePosition)
    const linePos = linePosition + linePositionOffset
    const line: INode = this._textLines[linePos]

    if (line.getSize() <= 0 && this.getLinesCount() > 1) {
      this._textLines = this._textLines.slice(0, linePos).concat(this._textLines.slice(linePos + 1))
      this._setLinePositionOffset(linePosition, -1)
      this._changes.set(line, [linePositionOffset + linePosition, TextRepresentationAction.REMOVE])
      return true
    }

    const endPosition: number = end === undefined ? line.getSize() : end

    line.removeText(
      0,
      start + this._getLineTextOffset(linePosition, start),
      endPosition + this._getLineTextOffset(linePosition, endPosition)
    )
    this._setLineTextOffset(linePosition, start, endPosition - start)
    this._changes.set(line, [linePositionOffset + linePosition, TextRepresentationAction.CHANGE])
    return false
  }

  deleteTextInRanges (textCursorPositions: IRange[]): void {
    for (const { startX, endX, startY, endY } of textCursorPositions) {
      if (startY === endY) {
        this.deleteTextInLine(startY, startX, endX)
        continue
      }

      this.deleteTextInLine(startY, startX)
      this.deleteTextInLine(endY, 0, endX)
      this.deleteLines(startY + 1, endY - startY - 1)
    }
  }

  getTextStylesInRanges (textCursorPositions: IRange[]): void {
    let output: TextStyleType[] = []

    for (const { startX, endX, startY, endY } of textCursorPositions) {
      const startLine: INode = this._textLines[startY + this._getLinePositionOffset(startY)]
      if (startY === endY) {
        output = output.concat(startLine.textStylesInRange(
          0,
          startX + this._getLineTextOffset(startY, startX),
          endX + this._getLineTextOffset(endY, endX)
        ))
        continue
      }

      const startLineStart: number = startX + this._getLineTextOffset(startY, startX)
      output.concat(startLine.textStylesInRange(0, startLineStart, startLineStart + startLine.getSize())
      )
      for (let i = startY + 1; i < endY; i++) {
        const curLine: INode = this._textLines[i + this._getLinePositionOffset(i)]
        output = output.concat(curLine.textStylesInRange(0, 0, curLine.getSize()))
      }
      output = output.concat(this._textLines[endY + this._getLinePositionOffset(startY)]
        .textStylesInRange(0, 0, endX + this._getLineTextOffset(endY, endX)))
    }

    this._activeTextStyles = output
  }

  addTextStylesInRanges (textStyleType: TextStyleType, textCursorPositions: IRange[]): void {
    for (const { startX, endX, startY, endY } of textCursorPositions) {
      const startLineOffset: number = this._getLinePositionOffset(startY)
      const startLine = this._textLines[startY + startLineOffset]
      this._changes.set(startLine, [startLineOffset + startY, TextRepresentationAction.CHANGE])

      if (startY === endY) {
        startLine.addTextStyle(
          0,
          startX + this._getLineTextOffset(startY, startX),
          endX + this._getLineTextOffset(endY, endX),
          textStyleType
        )
        continue
      }

      const startLineStart: number = startX + this._getLineTextOffset(startY, startX)
      startLine.addTextStyle(0, startLineStart, startLineStart + startLine.getSize(), textStyleType)

      for (let i = startY + 1; i < endY; i++) {
        const curLineOffset: number = this._getLinePositionOffset(i)
        const curLine = this._textLines[i + curLineOffset]
        curLine.addTextStyle(0, 0, curLine.getSize(), textStyleType)
        this._changes.set(curLine, [curLineOffset + i, TextRepresentationAction.CHANGE])
      }

      const endLineOffset: number = this._getLinePositionOffset(endY)
      const endLine = this._textLines[endY + endLineOffset]
      endLine.addTextStyle(0, 0, endX + this._getLineTextOffset(endY, endX), textStyleType)
      this._changes.set(endLine, [endLineOffset + endY, TextRepresentationAction.CHANGE])
    }
  }

  // try to find way to use private function that will just accept remove(All/Concrete)TextStyle instead of copy two near the same functions
  removeAllTextStylesInRanges (textCursorPositions: IRange[]): void {
    for (const { startX, endX, startY, endY } of textCursorPositions) {
      const startLineOffset = this._getLinePositionOffset(startY)
      const startLine = this._textLines[startY + startLineOffset]
      this._changes.set(startLine, [startLineOffset + startY, TextRepresentationAction.CHANGE])

      if (startY === endY) {
        startLine.removeAllTextStyles(
          0,
          startX + this._getLineTextOffset(startY, startX),
          endX + this._getLineTextOffset(endY, endX)
        )
        continue
      }

      const startLineStart: number = startX + this._getLineTextOffset(startY, startX)
      startLine.removeAllTextStyles(0, startLineStart, startLineStart + startLine.getSize())

      for (let i = startY + 1; i < endY; i++) {
        const curLineOffset: number = this._getLinePositionOffset(i)
        const curLine = this._textLines[i + curLineOffset]
        curLine.removeAllTextStyles(0, 0, curLine.getSize())
        this._changes.set(curLine, [curLineOffset + i, TextRepresentationAction.CHANGE])
      }

      const endLineOffset = this._getLinePositionOffset(endY)
      const endLine = this._textLines[endY + endLineOffset]
      endLine.removeAllTextStyles(0, 0, endX + this._getLineTextOffset(endY, endX))
      this._changes.set(endLine, [endLineOffset + endY, TextRepresentationAction.CHANGE])
    }
  }

  removeConcreteTextStyleInRanges (textStyleType: TextStyleType, textCursorPositions: IRange[]): void {
    for (const { startX, endX, startY, endY } of textCursorPositions) {
      const startLineOffset = this._getLinePositionOffset(startY)
      const startLine = this._textLines[startY + startLineOffset]
      this._changes.set(startLine, [startLineOffset + startY, TextRepresentationAction.CHANGE])

      if (startY === endY) {
        startLine.removeConcreteTextStyle(
          0,
          startX + this._getLineTextOffset(startY, startX),
          endX + this._getLineTextOffset(endY, endX),
          textStyleType
        )
        continue
      }

      const startLineStart: number = startX + this._getLineTextOffset(startY, startX)
      startLine.removeConcreteTextStyle(0, startLineStart, startLineStart + startLine.getSize(), textStyleType)

      for (let i = startY + 1; i < endY; i++) {
        const curLineOffset: number = this._getLinePositionOffset(i)
        const curLine = this._textLines[i + curLineOffset]
        curLine.removeConcreteTextStyle(0, 0, curLine.getSize(), textStyleType)
        this._changes.set(curLine, [curLineOffset + i, TextRepresentationAction.CHANGE])
      }

      const endLineOffset = this._getLinePositionOffset(endY)
      const endLine = this._textLines[endY + endLineOffset]
      endLine.removeConcreteTextStyle(0, 0, endX + this._getLineTextOffset(endY, endX), textStyleType)
      this._changes.set(endLine, [endLineOffset + endY, TextRepresentationAction.CHANGE])
    }
  }

  subscribe (subscriber: ITextRepresentationSubscriber): void {
    this._subscribers.push(subscriber)
  }

  updateSubscribers (): void {
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
      sub.updateLineChanges(lineChanges)
      sub.updateActiveTextStyles(this._activeTextStyles)
    }

    this._reset()
  }
}

export { TextRepresentation }
