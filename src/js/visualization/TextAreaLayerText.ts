import { NodeRepresentation } from '../core/TextRepresentation/Nodes/NodeRepresentation'
import { BaseTextAreaLayerText } from './BaseTextAreaLayerText'
import { IElementSplit } from './ElementSplitsManager'

export class TextAreaLayerText extends BaseTextAreaLayerText {
  private _findHtmlPositionInElement (element: HTMLElement, route: number[]): { position: number, outerHtmlTags: string } {
    let outerHtmlTags: string = ''
    let position = 0
    let parent = element

    for (const r of route) {
      for (let i = 0; i < parent.children.length; i++) {
        const child: HTMLElement = parent.children[i] as HTMLElement
        if (i === r) {
          parent = child
          outerHtmlTags += `<${child.localName}>`
          position += parent.localName.length + 2
          break
        }
        position += child.outerHTML.length
      }
    }

    return { position, outerHtmlTags }
  }

  private _splitElement (
    element: HTMLElement,
    split: IElementSplit
  ): { leftPartHtml: string, rightPartHtml: string } {
    const { route, textSplitX } = split
    const { position, outerHtmlTags } = this._findHtmlPositionInElement(element, route)
    const splitPosition = position + textSplitX

    return {
      leftPartHtml: element.innerHTML.slice(0, splitPosition),
      rightPartHtml: outerHtmlTags + element.innerHTML.slice(splitPosition)
    }
  }

  private _sliceElement (element: HTMLElement, slices: IElementSplit[]): string[] {
    const linePartsHtml: string[] = []
    let { position: linePartLeftPosition, outerHtmlTags: linePartLeftTags } = this._findHtmlPositionInElement(element, slices[0].route)

    linePartLeftPosition += slices[0].textSplitX
    linePartsHtml.push(element.innerHTML.slice(0, linePartLeftPosition))

    for (let i = 1; i < slices.length; i++) {
      const { position: p, outerHtmlTags: o } = this._findHtmlPositionInElement(element, slices[i].route)
      const curP = p + slices[i].textSplitX

      linePartsHtml.push(linePartLeftTags + element.innerHTML.slice(linePartLeftPosition, curP))
      linePartLeftPosition = curP
      linePartLeftTags = o
    }

    linePartsHtml.push(linePartLeftTags + element.innerHTML.slice(linePartLeftPosition))

    return linePartsHtml
  }

  private _sliceLineIntoParts (line: HTMLElement): HTMLElement[] {
    const lineSplits: IElementSplit[] = this._measureHtmlTool.splitElementByDisplayWidth(line, this._context.lineBoundaries.width)

    if (lineSplits.length === 0) {
      return [line]
    } else if (lineSplits.length === 1) {
      const { leftPartHtml, rightPartHtml } = this._splitElement(line, lineSplits[0])
      const lineParts = [line.cloneNode(false) as HTMLElement, line.cloneNode(false) as HTMLElement]

      lineParts[0].innerHTML = leftPartHtml
      lineParts[1].innerHTML = rightPartHtml

      return lineParts
    } else {
      const lineParts: HTMLElement[] = []

      for (const linePartHtml of this._sliceElement(line, lineSplits)) {
        lineParts.push(line.cloneNode(false) as HTMLElement)
        lineParts[lineParts.length - 1].innerHTML = linePartHtml
      }

      return lineParts
    }
  }

  addTextLine (y: number, lineRepresentation: NodeRepresentation): void {
    this._context.addLine(y, this._sliceLineIntoParts(this._htmlCreator.createHtmlFromNodeRepresentation(lineRepresentation)))
  }

  changeTextLine (y: number, lineRepresentation: NodeRepresentation): void {
    this._context.changeLine(y, this._sliceLineIntoParts(this._htmlCreator.createHtmlFromNodeRepresentation(lineRepresentation)))
  }

  deleteTextLine (y: number): void {
    this._context.deleteLine(y)
  }
}
