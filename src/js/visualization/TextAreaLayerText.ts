import { NodeRepresentation } from '../core/TextRepresentation/Nodes/NodeRepresentation'
import { BaseTextAreaLayerText } from './BaseTextAreaLayerText'
import { IElementSplit } from './ElementSplitsManager'

export class TextAreaLayerText extends BaseTextAreaLayerText {
  private _splitElement (element: HTMLElement, split: IElementSplit, routeStartIndex: number = 0): [HTMLElement, HTMLElement] {
    const { route, textSplitX } = split
    const leftPart: HTMLElement = element.cloneNode(false) as HTMLElement
    const rightPart: HTMLElement = element.cloneNode(false) as HTMLElement

    for (let i = routeStartIndex; i < route.length - 1; i++) {
      const r = route[i]
      let l = 0
      for (l; l < r; l++) {
        leftPart.append(element.children[l].cloneNode(true))
      }

      if (i === route.length - 1) {
        leftPart.append(element.children[r].cloneNode(false))
        leftPart.children[leftPart.children.length - 1].textContent = (element.children[r] as HTMLElement).innerText.slice(0, textSplitX)

        rightPart.append(element.children[r].cloneNode(false))
        rightPart.children[rightPart.children.length - 1].textContent = (element.children[r] as HTMLElement).innerText.slice(textSplitX)
      } else {
        const [left, right] = this._splitElement(element.children[r] as HTMLElement, split, i)
        leftPart.append(left)
        rightPart.append(right)
      }

      for (l = r + 1; l < element.children.length; l++) {
        rightPart.append(element.children[l].cloneNode(true))
      }
    }

    return [leftPart, rightPart]
  }

  private _splitLineIntoParts (line: HTMLElement): HTMLElement[] {
    const lineSplits: IElementSplit[] = this._measureHtmlTool.splitElementByDisplayWidth(line, this._context.lineBoundaries.width)

    if (lineSplits.length === 0) {
      return [line]
    }

    const lineParts: HTMLElement[] = []

    for (const split of lineSplits) {
      lineParts.push(...this._splitElement(line, split))
    }

    return lineParts
  }

  addTextLine (y: number, lineRepresentation: NodeRepresentation): void {
    this._context.addLine(y, this._splitLineIntoParts(this._htmlCreator.createHtmlFromNodeRepresentation(lineRepresentation)))
  }

  changeTextLine (y: number, lineRepresentation: NodeRepresentation): void {
    this._context.changeLine(y, this._splitLineIntoParts(this._htmlCreator.createHtmlFromNodeRepresentation(lineRepresentation)))
  }

  deleteTextLine (y: number): void {
    this._context.deleteLine(y)
  }
}
