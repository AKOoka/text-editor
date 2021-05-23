import { IRange } from '../common/IRange'
import { TextAreaTextSelection } from './TextAreaTextSelection'

type TextAreaHtmlSelection = Array<{
  y: number
  x: number
  htmlElement: HTMLElement
}>

class TextAreaTextSelectionPool {
  private _selectionPool: TextAreaTextSelection[]

  constructor () {
    this._selectionPool = []
  }

  // updateSelections (selections: IRange[]): void {
  //   if (selections.length === 0) {
  //     for (const selection of this._selectionPool) {
  //       selection.remove()
  //     }
  //     return
  //   }

  updateSelections (selections: IRange[]): TextAreaHtmlSelection[] {
    for (const selection of this._selectionPool) {
      selection.remove()
    }
    this._selectionPool = []

    const outputSelections: TextAreaHtmlSelection[] = []

    for (let l = 0; l < selections.length; l++) {
      const { startX, startY, endX, endY } = selections[l]
      const selection = new TextAreaTextSelection(startY, endY)
      const selectionParts = selection.getParts()
      this._selectionPool.push(selection)

      outputSelections.push([])
      outputSelections[l].push({
        y: startY,
        x: startX,
        htmlElement: selectionParts[0]
      })
      for (let i = 1; i < selectionParts.length; i++) {
        const curY: number = startY + i
        outputSelections[l].push({
          y: curY,
          x: 0,
          htmlElement: selectionParts[i]
        })
      }
      outputSelections[l].push({
        y: endY,
        x: endX,
        htmlElement: selectionParts[selectionParts.length - 1]
      })
    }

    return outputSelections
  }
}

export { TextAreaTextSelectionPool }
