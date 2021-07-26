import { NodeRepresentation } from '../core/TextRepresentation/Nodes/NodeRepresentation'
import { IElementSplit } from './ElementSplitsManager'
import { TextAreaContextWithMeasurer } from './TextAreaContextWithMeasurer'

export class TextAreaTextManager {
  private readonly _context: TextAreaContextWithMeasurer

  constructor (context: TextAreaContextWithMeasurer) {
    this._context = context
  }

  private _splitElement (element: HTMLElement, split: IElementSplit): [HTMLElement, HTMLElement] {
    const { route, textSplitX } = split
    const leftPart: HTMLElement = element.cloneNode(false) as HTMLElement
    const rightPart: HTMLElement = element.cloneNode(false) as HTMLElement
    let i: number

    if (route.length === 0) {
      leftPart.innerText = element.innerText.slice(0, textSplitX)
      rightPart.innerText = element.innerText.slice(textSplitX)

      return [leftPart, rightPart]
    }

    for (i = 0; i < route[0]; i++) {
      leftPart.append(element.children[i].cloneNode(true))
    }

    const [left, right] = this._splitElement(element.children[route[0]].cloneNode(true) as HTMLElement, { route: route.slice(1), textSplitX })

    leftPart.append(left)
    rightPart.append(right)

    for (i = route[0] + 1; i < element.children.length; i++) {
      rightPart.append((element.children[i] as HTMLElement).cloneNode(true))
    }

    return [leftPart, rightPart]
  }

  private _sliceElement (element: HTMLElement, startSplit: IElementSplit, endSplit: IElementSplit): HTMLElement {
    const { route: startRoute, textSplitX: startTextSplit } = startSplit
    const { route: endRoute, textSplitX: endTextSplit } = endSplit
    const slicedElement: HTMLElement = element.cloneNode(false) as HTMLElement

    if (startRoute[0] === endRoute[0]) {
      if (startRoute.length > 0) {
        slicedElement.append(this._sliceElement(
          element.children[startRoute[0]].cloneNode(true) as HTMLElement,
          { route: startRoute.slice(1), textSplitX: startTextSplit },
          { route: endRoute.slice(1), textSplitX: endTextSplit }
        ))
      } else {
        slicedElement.innerText = element.innerText.slice(startTextSplit, endTextSplit)
      }
    } else {
      slicedElement.append(this._splitElement(
        element.children[startRoute[0]].cloneNode(true) as HTMLElement,
        { route: startRoute.slice(1), textSplitX: startTextSplit }
      )[0])

      for (let i = startRoute[0] + 1; i < endRoute[0]; i++) {
        slicedElement.append(element.children[i].cloneNode(true))
      }

      slicedElement.append(this._splitElement(
        element.children[endRoute[0]].cloneNode(true) as HTMLElement,
        { route: endRoute.slice(1), textSplitX: endTextSplit }
      )[1])
    }

    return slicedElement
  }

  private _sliceLineIntoParts (line: HTMLElement): HTMLElement[] {
    const lineSplits: IElementSplit[] = this._context.splitElementByDisplayWidth(line)

    if (lineSplits.length === 0) {
      return [line]
    } else if (lineSplits.length === 1) {
      return this._splitElement(line, lineSplits[0])
    } else {
      const newLines: HTMLElement[] = []

      newLines.push(this._splitElement(line, lineSplits[0])[0])

      for (let i = 1; i < lineSplits.length; i++) {
        newLines.push(this._sliceElement(line, lineSplits[i - 1], lineSplits[i]))
      }

      newLines.push(this._splitElement(line, lineSplits[lineSplits.length - 1])[1])

      return newLines
    }
  }

  addTextLine (y: number, lineRepresentation: NodeRepresentation): void {
    this._context.addLine(y, this._sliceLineIntoParts(this._context.createHtmlFromNodeRepresentation(lineRepresentation)))
  }

  changeTextLine (y: number, lineRepresentation: NodeRepresentation): void {
    this._context.changeLine(y, this._sliceLineIntoParts(this._context.createHtmlFromNodeRepresentation(lineRepresentation)))
  }

  deleteTextLine (y: number): void {
    this._context.deleteLine(y)
  }
}
