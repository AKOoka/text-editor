// import { Point } from '../common/Point'
import { Range } from '../common/Range'
import { Selection } from '../common/Selection'
import { TextAreaContextWithMeasurer } from './TextAreaContextWithMeasurer'

export interface SelectionPart {
  y: number
  linePartY: number
  rangeX: Range
}

export class TextAreaTextSelectionManager {
  private readonly _context: TextAreaContextWithMeasurer
  private _textSelection: HTMLElement[]

  constructor (context: TextAreaContextWithMeasurer) {
    this._context = context
    this._textSelection = []
  }

  // private _adjustSelectionToLine (y: number, rangeX: Range): SelectionPart[] {
  //   const { linePartY: startLinePartY, linePartOffsetX: startLinePartOffsetX } = this._context.getLinePartY(new Point(rangeX.start, y))
  //   const { linePartY: endLinePartY, linePartOffsetX: endLinePartOffsetX } = this._context.getLinePartY(new Point(rangeX.end, y))

  //   if (startLinePartY === endLinePartY) {
  //     return [{
  //       y,
  //       linePartY: startLinePartY,
  //       rangeX: rangeX.translate(-startLinePartOffsetX)
  //     }]
  //   }

  //   const selectionParts: SelectionPart[] = []

  //   selectionParts.push({
  //     y,
  //     linePartY: startLinePartY,
  //     rangeX: rangeX.copy().reset(rangeX.start - startLinePartOffsetX, this._context.getLinePartWidth(y, startLinePartY))
  //   })

  //   for (let i = startLinePartY + 1; i < endLinePartY; i++) {
  //     selectionParts.push({ y, linePartY: i, rangeX: rangeX.copy().reset(0, this._context.getLinePartWidth(y, i)) })
  //   }

  //   selectionParts.push({
  //     y,
  //     linePartY: endLinePartY,
  //     rangeX: rangeX.copy().reset(0, rangeX.end - endLinePartOffsetX)
  //   })

  //   return selectionParts
  // }

  // private _splitSelection (displaySelection: Selection): SelectionPart[] {
  //   if (displaySelection.rangeY.width === 0) {
  //     return this._adjustSelectionToLine(displaySelection.startY, displaySelection.rangeX)
  //   }

  //   const { startX, startY, endX, endY, rangeX } = displaySelection
  //   const selectionParts: SelectionPart[] = []

  //   selectionParts.push(...this._adjustSelectionToLine(startY, rangeX.copy().reset(startX, this._context.getLineWidth(startY))))

  //   for (let i = displaySelection.startY + 1; i < displaySelection.endY; i++) {
  //     selectionParts.push(...this._adjustSelectionToLine(i, rangeX.copy().reset(0, this._context.getLineWidth(startY))))
  //   }

  //   selectionParts.push(...this._adjustSelectionToLine(endY, rangeX.copy().reset(0, endX)))

  //   return selectionParts
  // }

  private _createHtmlSelectionPart (rangeX: Range): HTMLElement {
    const selectionPartHtml: HTMLElement = this._context.createHtmlElement('span')
    const { start: left, width } = rangeX

    selectionPartHtml.classList.add('text-selection')
    selectionPartHtml.style.left = `${left}px`
    selectionPartHtml.style.width = `${width}px`

    return selectionPartHtml
  }

  private _addSelectionToLine (selection: Selection): void {
    const { displayRangesX, startLinePartY, endLinePartY } = this._context.convertRangeXToDisplayRangeX(
      selection.startY,
      selection.rangeX.copy()
    )
    let partIndex: number = 0
    for (let j = startLinePartY; j <= endLinePartY; j++) {
      const htmlSelectionPart = this._createHtmlSelectionPart(displayRangesX[partIndex])
      this._context.addNodeToLinePartEnd(selection.startY, j, htmlSelectionPart)
      this._textSelection.push(htmlSelectionPart)
      partIndex++
    }
  }

  addSelection (selection: Selection): void {
    // FIXME: when line is empty i get -number in rangeX.start
    if (selection.rangeY.width === 0) {
      this._addSelectionToLine(selection)
      return
    }

    const { startX, startY, endX, endY } = selection

    this._addSelectionToLine(selection.copy().resetWithPositions(startX, startY, this._context.getLineWidth(startY), startY))

    for (let i = selection.startY + 1; i < selection.endY; i++) {
      this._addSelectionToLine(selection.copy().resetWithPositions(0, i, this._context.getLineWidth(i), i))
    }

    this._addSelectionToLine(selection.copy().resetWithPositions(0, endY, endX, endY))
  }

  removeAllTextSelections (): void {
    for (const textSelection of this._textSelection) {
      textSelection.remove()
    }
    this._textSelection = []
  }
}
