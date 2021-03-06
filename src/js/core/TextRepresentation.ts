import { ITextRepresentation } from './ITextRepresentation'
import { IRange } from '../common/IRange'
import { ITextRepresentationSubscriber } from '../common/ITextRepresentationSubscriber'
import { INode } from './INode'
import { NodeText } from './NodeText'
import { TextStyleType } from '../common/TextStyleType'
import { HtmlTextRepresentationChanges } from './HtmlTextRepresentationChanges'
import { ILineTextOffset } from './ILineTextOffset'
import { TextRepresentationChangeType } from '../common/TextRepresentationChangeType'
import { NodeContainer } from './NodeContainer'

class TextRepresentation implements ITextRepresentation {
  private _textLines: Array<INode<HTMLElement>>
  private readonly _subscribers: Array<ITextRepresentationSubscriber<HtmlTextRepresentationChanges>>
  private _linePositionOffset: Map<number, number>
  private _lineTextOffset: Map<number, ILineTextOffset[]>
  private _changes: HtmlTextRepresentationChanges
  private _activeTextStyles: TextStyleType[]

  constructor () {
    // this._textLines = [new NodeContainer([new NodeText('')])]
    this._textLines = []
    this._subscribers = []
    this._linePositionOffset = new Map()
    this._lineTextOffset = new Map()
    this._changes = new HtmlTextRepresentationChanges()
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

  // private _replaceEmptyLine (linePosition: number): void {
  //   this._textLines = this._textLines
  //     .slice(0, linePosition)
  //     .concat(
  //       [new NodeText('')],
  //       this._textLines.slice(linePosition + 1)
  //     )
  // }

  getLinesCount (): number {
    return this._textLines.length
  }

  createNewLines (linePosition: number, count: number): void {
    const linePositionOffset: number = this._getLinePositionOffset(linePosition)
    const newLines = []
    for (let i = 0; i < count; i++) {
      newLines.push(new NodeContainer([new NodeText('')]))
    }
    this._textLines = this._textLines
      .slice(0, linePosition + linePositionOffset)
      .concat(newLines, this._textLines.slice(linePosition + linePositionOffset))

    this._setLinePositionOffset(linePosition, count)

    for (let i = 0; i < count; i++) {
      this._changes.addChange(linePositionOffset + i, linePosition + i, TextRepresentationChangeType.Add, newLines[i])
    }
  }

  deleteLines (linePosition: number, count: number): void {
    const lineOffset = this._getLinePositionOffset(linePosition)
    this._textLines.splice(linePosition + lineOffset, count)
    this._setLinePositionOffset(linePosition, -count)
    for (let i = 0; i < count; i++) {
      this._changes.addChange(lineOffset, linePosition, TextRepresentationChangeType.Remove)
    }
  }

  addTextInLine (text: string, linePosition: number, textPosition: number): void {
    const lineOffset = this._getLinePositionOffset(linePosition)
    const line = this._textLines[linePosition + lineOffset]
    line.addText(text, 0, textPosition + this._getLineTextOffset(linePosition, textPosition))
    this._setLineTextOffset(linePosition, textPosition, text.length)
    this._changes.addChange(lineOffset, linePosition, TextRepresentationChangeType.Change, line)
  }

  deleteTextInLine (linePosition: number, start: number, end?: number): void {
    const linePositionOffset: number = this._getLinePositionOffset(linePosition)
    const linePos = linePosition + linePositionOffset
    const line: INode<HTMLElement> = this._textLines[linePos]
    const endPosition: number = end === undefined ? line.getSize() : end
    const isEmptyLine: boolean = line.removeText(
      0,
      start + this._getLineTextOffset(linePosition, start),
      endPosition + this._getLineTextOffset(linePosition, endPosition)
    )

    if (isEmptyLine) {
      // this._replaceEmptyLine(linePosition + linePositionOffset)
      this._textLines = this._textLines.slice(0, linePos).concat(this._textLines.slice(linePos + 1))
      this._setLinePositionOffset(linePosition, -1)
      this._changes.addChange(linePositionOffset - 1, linePosition, TextRepresentationChangeType.Remove)
      return
    }

    this._setLineTextOffset(linePosition, start, endPosition - start)
    this._changes.addChange(linePositionOffset, linePosition, TextRepresentationChangeType.Change, line)
  }

  deleteTextInRanges (textCursorPositions: IRange[]): void {
    for (const { start, end, startLinePosition, endLinePosition } of textCursorPositions) {
      if (startLinePosition === endLinePosition) {
        this.deleteTextInLine(startLinePosition, start, end)
        continue
      }

      this.deleteTextInLine(startLinePosition, start)
      // for (let i = startLinePosition + 1; i < endLinePosition; i++) {
      //   this.deleteTextInLine(i, 0)
      // }
      this.deleteTextInLine(endLinePosition, 0, end)
      this.deleteLines(startLinePosition + 1, endLinePosition - startLinePosition - 1)
    }
  }

  getTextStylesInRanges (textCursorPositions: IRange[]): void {
    let output: TextStyleType[] = []

    for (const { start, end, startLinePosition, endLinePosition } of textCursorPositions) {
      if (startLinePosition === endLinePosition) {
        output = output.concat(this._textLines[startLinePosition + this._getLinePositionOffset(startLinePosition)]
          .textStylesInRange(
            0,
            start + this._getLineTextOffset(startLinePosition, start),
            end + this._getLineTextOffset(endLinePosition, end)
          )
        )
        continue
      }

      output.concat(this._textLines[startLinePosition + this._getLinePositionOffset(startLinePosition)]
        .textStylesInRange(0, start + this._getLineTextOffset(startLinePosition, start)))
      for (let i = startLinePosition + 1; i < endLinePosition; i++) {
        output = output.concat(this._textLines[i + this._getLinePositionOffset(i)]
          .textStylesInRange(0, 0))
      }
      output = output.concat(this._textLines[endLinePosition + this._getLinePositionOffset(startLinePosition)]
        .textStylesInRange(0, 0, end + this._getLineTextOffset(endLinePosition, end)))
    }

    this._activeTextStyles = output
  }

  addTextStylesInRanges (textStyleType: TextStyleType, textCursorPositions: IRange[]): void {
    for (const { start, end, startLinePosition, endLinePosition } of textCursorPositions) {
      const startLineOffset: number = this._getLinePositionOffset(startLinePosition)
      const startLine = this._textLines[startLinePosition + startLineOffset]
      this._changes.addChange(startLineOffset, startLinePosition, TextRepresentationChangeType.Change, startLine)

      if (startLinePosition === endLinePosition) {
        startLine.addTextStyle(
          textStyleType,
          0,
          start + this._getLineTextOffset(startLinePosition, start),
          end + this._getLineTextOffset(endLinePosition, end)
        )
        continue
      }

      startLine.addTextStyle(textStyleType, 0, start + this._getLineTextOffset(startLinePosition, start))

      for (let i = startLinePosition + 1; i < endLinePosition; i++) {
        const curLineOffset: number = this._getLinePositionOffset(i)
        const curLine = this._textLines[i + curLineOffset]
        curLine.addTextStyle(textStyleType, 0, 0)
        this._changes.addChange(curLineOffset, i, TextRepresentationChangeType.Change, curLine)
      }

      const endLineOffset: number = this._getLinePositionOffset(endLinePosition)
      const endLine = this._textLines[endLinePosition + endLineOffset]
      endLine.addTextStyle(textStyleType, 0, 0, end + this._getLineTextOffset(endLinePosition, end))
      this._changes.addChange(endLineOffset, endLinePosition, TextRepresentationChangeType.Change, endLine)
    }
  }

  // make functions remove(Concrete/All)TextStyleInRange
  removeTextStylesInRanges (textStyleType: TextStyleType, textCursorPositions: IRange[]): void {
    for (const { start, end, startLinePosition, endLinePosition } of textCursorPositions) {
      const startLineOffset = this._getLinePositionOffset(startLinePosition)
      const startLine = this._textLines[startLinePosition + startLineOffset]
      this._changes.addChange(startLineOffset, startLinePosition, TextRepresentationChangeType.Change, startLine)

      if (startLinePosition === endLinePosition) {
        startLine.removeConcreteTextStyle(
          textStyleType,
          0,
          start + this._getLineTextOffset(startLinePosition, start),
          end + this._getLineTextOffset(endLinePosition, end)
        )
        continue
      }

      startLine.removeConcreteTextStyle(textStyleType, 0, start + this._getLineTextOffset(startLinePosition, start))

      for (let i = startLinePosition + 1; i < endLinePosition; i++) {
        const curLineOffset: number = this._getLinePositionOffset(i)
        const curLine = this._textLines[i + curLineOffset]
        curLine.removeConcreteTextStyle(textStyleType, 0, 0)
        this._changes.addChange(curLineOffset, i, TextRepresentationChangeType.Change, curLine)
      }

      const endLineOffset = this._getLinePositionOffset(endLinePosition)
      const endLine = this._textLines[endLinePosition + endLineOffset]
      endLine.removeConcreteTextStyle(textStyleType, 0, 0, end + this._getLineTextOffset(endLinePosition, end))
      this._changes.addChange(endLineOffset, endLinePosition, TextRepresentationChangeType.Change, endLine)
    }
  }

  subscribe (subscriber: ITextRepresentationSubscriber<HtmlTextRepresentationChanges>): void {
    this._subscribers.push(subscriber)
  }

  updateSubscribers (): void {
    this._changes.renderLines()

    for (const sub of this._subscribers) {
      sub.updateTextRepresentation({ lineChanges: this._changes, activeStyles: this._activeTextStyles })
    }

    this._linePositionOffset = new Map()
    this._lineTextOffset = new Map()
    this._changes = new HtmlTextRepresentationChanges()
    this._activeTextStyles = []
  }
}

export { TextRepresentation }
