import { IRange } from '../common/IRange'
import { ITextCursorSubscriber } from '../common/ITextCursorSubscriber'
import { ITextRepresentationSubscriber } from '../common/ITextRepresentationSubscriber'
import { TextRepresentationChangeType } from '../common/TextRepresentationChangeType'
import { HtmlTextRepresentationChanges } from '../core/HtmlTextRepresentationChanges'
import { ITextRepresentationChanges } from '../common/ITextRepresentationChanges'

class HtmlTextArea implements ITextRepresentationSubscriber<HtmlTextRepresentationChanges>, ITextCursorSubscriber {
  private readonly _context: HTMLElement
  private readonly _ctx2d: CanvasRenderingContext2D
  private readonly _htmlTextCursor: HTMLElement
  private _textLines: HTMLElement[]
  private _htmlSelections: HTMLElement[]

  constructor () {
    this._context = document.createElement('div')
    this._context.classList.add('text-area')
    this._textLines = []
    this._htmlTextCursor = document.createElement('div')
    this._htmlTextCursor.classList.add('text-cursor')
    this._htmlSelections = []

    const canvasContext = document.createElement('canvas').getContext('2d')
    if (canvasContext === null) {
      throw new Error("couldn't create canvas context 2d")
    }
    this._ctx2d = canvasContext
    window.onload = () => { // it fixes the problem with styles don't loaded when window.getComputedStyle tries to get them
      const initFont = window.getComputedStyle(this._context)
      this._ctx2d.font = `${initFont.getPropertyValue('font-size')} ${initFont.getPropertyValue('font-family')}`
    }
  }

  private _removeTextLine (linePosition: number): void {
    this._textLines[linePosition].remove()
    this._textLines.splice(linePosition, 1)
  }

  private _addTextLine (linePosition: number, line: HTMLElement): void {
    this._context.insertBefore(line, this._textLines[linePosition + 1])
    this._textLines = this._textLines
      .slice(0, linePosition)
      .concat(line, this._textLines.slice(linePosition))
  }

  private _changeTextLine (linePosition: number, line: HTMLElement): void {
    this._textLines[linePosition].replaceWith(line)
    this._textLines = this._textLines
      .slice(0, linePosition)
      .concat(line, this._textLines.slice(linePosition + 1))
  }

  private _createSelection (position: number, width: number): HTMLElement {
    const selection = document.createElement('div')
    selection.classList.add('selection')
    selection.style.left = `${position}px`
    selection.style.width = `${width}px`
    return selection
  }

  getContext (): HTMLElement {
    return this._context
  }

  updateTextCursorPosition (position: number, linePosition: number, selections: IRange[]): void {
    const textLine = this._textLines[linePosition]
    this._htmlTextCursor.remove()
    textLine.append(this._htmlTextCursor)
    for (const sel of this._htmlSelections) {
      sel.remove()
    }
    this._htmlSelections = []

    this._htmlTextCursor.style.left = `${this._ctx2d.measureText(textLine.innerText.slice(0, position)).width}px`
    for (const { start, end, startLinePosition, endLinePosition } of selections) {
      if (startLinePosition === endLinePosition) {
        const line = this._textLines[startLinePosition]
        const newSelection = this._createSelection(start, this._ctx2d.measureText(line.innerText.slice(start, end)).width)
        this._htmlSelections.push(newSelection)
        line.append(newSelection)
        continue
      }

      const startLine = this._textLines[startLinePosition]
      const startSelection = this._createSelection(start, this._ctx2d.measureText(startLine.innerText.slice(start)).width)
      this._htmlSelections.push(startSelection)
      startLine.append(startSelection)
      for (let i = startLinePosition + 1; i < endLinePosition; i++) {
        const curLine = this._textLines[i]
        const middleSelection = this._createSelection(0, this._ctx2d.measureText(curLine.innerText).width)
        this._htmlSelections.push(startSelection)
        curLine.append(middleSelection)
      }
      const endLine = this._textLines[endLinePosition]
      const endSelection = this._createSelection(this._ctx2d.measureText(endLine.innerText.slice(0, end)).width, end)
      this._htmlSelections.push(endSelection)
      endLine.append(endSelection)
    }
  }

  updateTextRepresentation (changes: ITextRepresentationChanges<HtmlTextRepresentationChanges>): void {
    for (let i = 0; i < changes.lineChanges.getSize(); i++) {
      const { line, linePosition, lineChangeType } = changes.lineChanges.getLine(i)

      switch (lineChangeType) {
        case TextRepresentationChangeType.Remove:
          this._removeTextLine(linePosition)
          break
        case TextRepresentationChangeType.Add:
          this._addTextLine(linePosition, line)
          break
        case TextRepresentationChangeType.Change:
          this._changeTextLine(linePosition, line)
          break
      }
    }
  }
}

export { HtmlTextArea }
