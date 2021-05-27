import { TextAreaTextSelection } from './TextAreaTextSelection'
import { ITextAreaHtmlSelectionPart } from './ITextAreaHtmlSelectionPart'
import { ISelection } from '../common/ISelection'

class TextAreaTextSelectionPool {
  private _selectionPool: TextAreaTextSelection[]

  constructor (size: number) {
    this._selectionPool = []

    for (let i = 0; i < size; i++) {
      this._selectionPool.push()
    }
  }

  updateSelections (selections: ISelection[]): ITextAreaHtmlSelectionPart[][] {
    for (const selection of this._selectionPool) {
      selection.remove()
    }
    this._selectionPool = []

    const outputSelections: ITextAreaHtmlSelectionPart[][] = []

    for (let l = 0; l < selections.length; l++) {
      const { rangeX: { start: x, end: endX }, rangeY: { start: y, end: endY } } = selections[l]
      const selection = new TextAreaTextSelection(y, endY)
      const selectionParts = selection.getParts()
      this._selectionPool.push(selection)

      outputSelections.push([])

      if (selectionParts.length === 1) {
        outputSelections[l].push({
          y: y,
          left: x,
          right: endX,
          htmlElement: selectionParts[0]
        })
        continue
      }

      outputSelections[l].push({
        y: y,
        left: x,
        right: 0,
        htmlElement: selectionParts[0]
      })
      for (let i = 1; i < selectionParts.length; i++) {
        const curY: number = y + i
        outputSelections[l].push({
          y: curY,
          left: 0,
          right: 0,
          htmlElement: selectionParts[i]
        })
      }
      outputSelections[l].push({
        y: endY,
        left: 0,
        right: endX,
        htmlElement: selectionParts[selectionParts.length - 1]
      })
    }

    return outputSelections
  }
}

export { TextAreaTextSelectionPool }
