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

  private _createHtmlSelectionPart (displayY: number, displayHeight: number, displayRangeX: Range): HTMLElement {
    const selectionPartHtml: HTMLElement = this._context.createHtmlElement('span')
    const { start: left, width } = displayRangeX

    selectionPartHtml.classList.add('text-selection')
    selectionPartHtml.style.left = `${left}px`
    selectionPartHtml.style.width = `${width}px`
    selectionPartHtml.style.top = `${displayY}px`
    selectionPartHtml.style.height = `${displayHeight}px`

    return selectionPartHtml
  }

  private _addSelectionToLine (y: number, rangeX: Range): void {
    const { displayRangesX, startLinePartY, endLinePartY } = this._context.convertRangeXToDisplayRangeX(y, rangeX.copy())
    let partIndex: number = 0
    for (let j = startLinePartY; j <= endLinePartY; j++) {
      const htmlSelectionPart = this._createHtmlSelectionPart(
        this._context.computeLinePartDisplayY(y, j),
        this._context.computeLinePartDisplayHeight(y, j),
        displayRangesX[partIndex]
      )
      this._context.addSelection(htmlSelectionPart)
      this._textSelection.push(htmlSelectionPart)
      partIndex++
    }
  }

  addSelection (selection: Selection): void {
    // FIXME: when line is empty i get -number in rangeX.start
    if (selection.rangeY.width === 0) {
      this._addSelectionToLine(selection.startY, selection.rangeX)
      return
    }

    const { startX, startY, endX, endY } = selection

    // this._addSelectionToLine(selection.copy().resetWithPositions(startX, startY, this._context.getLineWidth(startY), startY))
    this._addSelectionToLine(startY, new Range(startX, this._context.getLineWidth(startY)))

    for (let i = selection.startY + 1; i < selection.endY; i++) {
      // this._addSelectionToLine(selection.copy().resetWithPositions(0, i, this._context.getLineWidth(i), i))
      this._addSelectionToLine(i, new Range(0, this._context.getLineWidth(i)))
    }

    // this._addSelectionToLine(selection.copy().resetWithPositions(0, endY, endX, endY))
    this._addSelectionToLine(endY, new Range(0, endX))
  }

  removeAllTextSelections (): void {
    for (const textSelection of this._textSelection) {
      textSelection.remove()
    }
    this._textSelection = []
  }
}
