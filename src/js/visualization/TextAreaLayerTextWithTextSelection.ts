import { Point } from '../common/Point'
import { Range } from '../common/Range'
import { Selection } from '../common/Selection'
import { TextAreaLayerText } from './TextAreaLayerText'

export interface SelectionPart {
  y: number
  linePartY: number
  rangeX: Range
}

export class TextAreaLayerTextWithTextSelection extends TextAreaLayerText {
  private _textSelection: HTMLElement[]

  constructor () {
    super()
    this._textSelection = []
  }

  private _adjustSelectionToLine (y: number, rangeX: Range): SelectionPart[] {
    const { linePartY: startLinePartY, linePartOffsetX: startLinePartOffsetX } = this._context.getLinePartY(new Point(rangeX.start, y))
    const { linePartY: endLinePartY, linePartOffsetX: endLinePartOffsetX } = this._context.getLinePartY(new Point(rangeX.end, y))

    if (startLinePartY === endLinePartY) {
      return [{
        y,
        linePartY: startLinePartY,
        rangeX: rangeX.translate(-startLinePartOffsetX)
      }]
    }

    const selectionParts: SelectionPart[] = []

    selectionParts.push({
      y,
      linePartY: startLinePartY,
      rangeX: rangeX.copy().reset(rangeX.start - startLinePartOffsetX, this._context.getLinePartWidth(y, startLinePartY))
    })

    for (let i = startLinePartY + 1; i < endLinePartY; i++) {
      selectionParts.push({ y, linePartY: i, rangeX: rangeX.copy().reset(0, this._context.getLinePartWidth(y, i)) })
    }

    selectionParts.push({
      y,
      linePartY: endLinePartY,
      rangeX: rangeX.copy().reset(0, rangeX.end - endLinePartOffsetX)
    })

    return selectionParts
  }

  private _splitSelection (displaySelection: Selection): SelectionPart[] {
    // FIXME: Here i accept display selection but this._adjustSelectionToLine() use character selection
    if (displaySelection.rangeY.width === 0) {
      return this._adjustSelectionToLine(displaySelection.startY, displaySelection.rangeX)
    }

    const { startX, startY, endX, endY, rangeX } = displaySelection
    const selectionParts: SelectionPart[] = []

    selectionParts.push(...this._adjustSelectionToLine(startY, rangeX.copy().reset(startX, this._context.getLineWidth(startY))))

    for (let i = displaySelection.startY + 1; i < displaySelection.endY; i++) {
      selectionParts.push(...this._adjustSelectionToLine(i, rangeX.copy().reset(0, this._context.getLineWidth(startY))))
    }

    selectionParts.push(...this._adjustSelectionToLine(endY, rangeX.copy().reset(0, endX)))

    return selectionParts
  }

  private _createHtmlSelectionPart (displaySelectionPart: SelectionPart): HTMLElement {
    const selectionPartHtml: HTMLElement = this._htmlCreator.createHtmlElement('span')
    const { start: left, width } = displaySelectionPart.rangeX

    selectionPartHtml.classList.add('text-selection')
    selectionPartHtml.style.left = `${left}px`
    selectionPartHtml.style.width = `${width}px`

    return selectionPartHtml
  }

  addSelection (selection: Selection): void {
    const displaySelection: Selection = selection
      .copy()
      .resetStartPoint(this.convertPointToDisplayPoint(selection.getStartPoint()))
      .resetEndPoint(this.convertPointToDisplayPoint(selection.getEndPoint()))

    for (const displaySelectionPart of this._splitSelection(displaySelection)) {
      const htmlSelectionPart = this._createHtmlSelectionPart(displaySelectionPart)
      this._context.addNodeToLinePartEnd(displaySelectionPart.y, displaySelectionPart.linePartY, htmlSelectionPart)
      this._textSelection.push(htmlSelectionPart)
    }
  }

  removeAllTextSelections (): void {
    for (const textSelection of this._textSelection) {
      textSelection.remove()
    }
    this._textSelection = []
  }
}
