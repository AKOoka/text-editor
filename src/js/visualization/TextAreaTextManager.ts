import { Range } from '../common/Range'
import { ILineContent } from '../core/text-representation/ILineContent'
import { LineStyle } from '../core/text-representation/LineWithStyles/LineStyle'
import { ILineWithStylesContent } from '../core/text-representation/LineWithStyles/LineWithStylesContent'
import { TextAreaContextWithMeasurer } from './TextAreaContextWithMeasurer'

export class TextAreaTextManager {
  private readonly _context: TextAreaContextWithMeasurer

  constructor (context: TextAreaContextWithMeasurer) {
    this._context = context
  }

  // private _splitHtmlElement (element: HTMLElement, split: IElementSplit): [HTMLElement, HTMLElement] {
  //   const { route, textSplitX } = split
  //   const leftPart: HTMLElement = element.cloneNode(false) as HTMLElement
  //   const rightPart: HTMLElement = element.cloneNode(false) as HTMLElement
  //   let i: number

  //   if (route.length === 0) {
  //     leftPart.innerText = element.innerText.slice(0, textSplitX)
  //     rightPart.innerText = element.innerText.slice(textSplitX)

  //     return [leftPart, rightPart]
  //   }

  //   for (i = 0; i < route[0]; i++) {
  //     leftPart.append(element.children[i].cloneNode(true))
  //   }

  //   const [left, right] = this._splitHtmlElement(element.children[route[0]].cloneNode(true) as HTMLElement, { route: route.slice(1), textSplitX })

  //   leftPart.append(left)
  //   rightPart.append(right)

  //   for (i = route[0] + 1; i < element.children.length; i++) {
  //     rightPart.append((element.children[i] as HTMLElement).cloneNode(true))
  //   }

  //   return [leftPart, rightPart]
  // }

  // private _sliceHtmlElement (element: HTMLElement, startSplit: IElementSplit, endSplit: IElementSplit): HTMLElement {
  //   const { route: startRoute, textSplitX: startTextSplit } = startSplit
  //   const { route: endRoute, textSplitX: endTextSplit } = endSplit
  //   const slicedElement: HTMLElement = element.cloneNode(false) as HTMLElement

  //   if (startRoute[0] === endRoute[0]) {
  //     if (startRoute.length > 0) {
  //       slicedElement.append(this._sliceHtmlElement(
  //         element.children[startRoute[0]].cloneNode(true) as HTMLElement,
  //         { route: startRoute.slice(1), textSplitX: startTextSplit },
  //         { route: endRoute.slice(1), textSplitX: endTextSplit }
  //       ))
  //     } else {
  //       slicedElement.innerText = element.innerText.slice(startTextSplit, endTextSplit)
  //     }
  //   } else {
  //     slicedElement.append(this._splitHtmlElement(
  //       element.children[startRoute[0]].cloneNode(true) as HTMLElement,
  //       { route: startRoute.slice(1), textSplitX: startTextSplit }
  //     )[0])

  //     for (let i = startRoute[0] + 1; i < endRoute[0]; i++) {
  //       slicedElement.append(element.children[i].cloneNode(true))
  //     }

  //     slicedElement.append(this._splitHtmlElement(
  //       element.children[endRoute[0]].cloneNode(true) as HTMLElement,
  //       { route: endRoute.slice(1), textSplitX: endTextSplit }
  //     )[1])
  //   }

  //   return slicedElement
  // }

  // private _sliceHtmlLineIntoParts (line: HTMLElement): HTMLElement[] {
  //   const lineSplits: IElementSplit[] = this._context.splitElementByDisplayWidth(line)

  //   if (lineSplits.length === 0) {
  //     return [line]
  //   } else if (lineSplits.length === 1) {
  //     return this._splitHtmlElement(line, lineSplits[0])
  //   } else {
  //     const newLines: HTMLElement[] = []

  //     newLines.push(this._splitHtmlElement(line, lineSplits[0])[0])

  //     for (let i = 1; i < lineSplits.length; i++) {
  //       newLines.push(this._sliceHtmlElement(line, lineSplits[i - 1], lineSplits[i]))
  //     }

  //     newLines.push(this._splitHtmlElement(line, lineSplits[lineSplits.length - 1])[1])

  //     return newLines
  //   }
  // }

  private _sliceLineStyles (lineStyle: LineStyle[], range: Range): LineStyle[] {
    // TODO: if lineStyle stay sorted i can add else { return styles }

    const styles: LineStyle[] = []

    for (const style of lineStyle) {
      if (style.range.isInsideRange(range)) {
        styles.push(style)
      } else if (style.range.isRangeInside(range)) {
        styles.push(style.reset(style.textStyle, range.copy()))
      } else if (style.range.isStartInRange(range)) {
        style.range.end = range.end
        styles.push(style)
      } else if (style.range.isEndInRange(range)) {
        style.range.start = range.start
        styles.push(style)
      }
    }

    return styles
  }

  private _sliceLineWithStyles (line: ILineWithStylesContent): ILineWithStylesContent[] {
    const splits: number[] = this._context.splitByDisplayWidthLineWithStyles(line)

    if (splits.length === 0) {
      return [line]
    } else if (splits.length === 1) {
      return [
        {
          text: line.text.slice(0, splits[0]),
          styles: this._sliceLineStyles(line.styles, new Range(0, splits[0]))
        },
        {
          text: line.text.slice(splits[0]),
          styles: this._sliceLineStyles(line.styles, new Range(splits[0], line.text.length))
        }
      ]
    } else {
      const slicedLines: ILineWithStylesContent[] = []
      let sliceStart: number = 0

      for (const s of splits) {
        slicedLines.push({
          text: line.text.slice(sliceStart, s),
          styles: this._sliceLineStyles(line.styles, new Range(sliceStart, s))
        })
        sliceStart = s
      }

      return slicedLines
    }
  }

  addTextLine (y: number, lineContent: ILineContent): void {
    // this._context.addLine(y, this._sliceHtmlLineIntoParts(this._context.createHtmlFromNodeRepresentation(lineRepresentation)))
    this._context.addLine(y, this._sliceLineWithStyles(lineContent.getContent()))
  }

  changeTextLine (y: number, lineContent: ILineContent): void {
    // this._context.changeLine(y, this._sliceHtmlLineIntoParts(this._context.createHtmlFromNodeRepresentation(lineRepresentation)))
    this._context.changeLine(y, this._sliceLineWithStyles(lineContent.getContent()))
  }

  deleteTextLine (y: number): void {
    this._context.deleteLine(y)
  }
}
