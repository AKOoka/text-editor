import { Point } from '../common/Point'
import { ElementSplitsManager, IElementSplit } from './ElementSplitsManager'

interface IGetChildOnXResult {
  child: HTMLElement
  childOffset: number
}

type GetChildOnDisplayXCallback = (childX: number) => void

interface IGetChildOnDisplayXResult {
  child: HTMLElement
  childX: number
  childDisplayX: number
}

class MeasureHtmlTool {
  private readonly _canvasContext: CanvasRenderingContext2D
  private _contextPoint: Point
  private _contextFont: string

  constructor () {
    const ctx = document.createElement('canvas').getContext('2d')
    if (ctx === null) {
      throw new Error("can't create canvas context 2d")
    }
    this._contextPoint = new Point(0, 0)
    this._canvasContext = ctx
  }

  private _getFontFromElement (htmlElement: HTMLElement): string {
    const font = window.getComputedStyle(htmlElement)
    return `${font.getPropertyValue('font-size')} ${font.getPropertyValue('font-family')}`
  }

  private _getChildOnX (parent: HTMLElement, x: number): IGetChildOnXResult {
    let childOffset: number = 0

    for (let i = 0; i < parent.children.length; i++) {
      const child: HTMLElement = parent.children[i] as HTMLElement

      if (x >= childOffset && x <= childOffset + child.innerText.length) {
        const result = this._getChildOnX(child, x)
        return {
          child: result.child,
          childOffset: childOffset + result.childOffset
        }
      }

      childOffset += child.innerText.length
    }

    return {
      child: parent,
      childOffset: 0
    }
  }

  private _getChildOnDisplayX (
    parent: HTMLElement,
    displayX: number,
    x: number = 0,
    callback: GetChildOnDisplayXCallback = () => {}
  ): IGetChildOnDisplayXResult {
    let childX: number = x

    for (let i = 0; i < parent.children.length; i++) {
      const child: HTMLElement = parent.children[i] as HTMLElement

      if (displayX >= child.offsetLeft && displayX <= child.offsetLeft + child.offsetWidth) {
        return this._getChildOnDisplayX(child, displayX, childX, callback)
      }

      childX += child.innerText.length
    }

    return { child: parent, childX, childDisplayX: parent.offsetLeft }
  }

  private _getXOnElement (element: HTMLElement, offsetDisplayX: number, displayX: number): number {
    let startDisplayX: number = offsetDisplayX

    this._canvasContext.font = this._getFontFromElement(element)

    for (let i = 0; i < element.innerText.length; i++) {
      const textWidth: number = this._canvasContext.measureText(element.innerText[i]).width

      if (displayX >= startDisplayX && displayX <= startDisplayX + textWidth) {
        return i
      }

      startDisplayX += textWidth
    }

    throw new Error("can't get text x on element")
    // return element.innerText.length
  }

  setContext (context: HTMLElement): void {
    this._contextPoint.x = context.getBoundingClientRect().x
    this._contextPoint.y = context.getBoundingClientRect().y
    this._contextFont = this._getFontFromElement(context)
    this._canvasContext.font = this._contextFont
    console.log(`text area font: ${this._contextFont}\ntext area context x: ${this._contextPoint.x}; y: ${this._contextPoint.y}`)
  }

  computeHtmlNodeWidth (node: Node, nodeParent: HTMLElement): number {
    this._canvasContext.font = this._getFontFromElement(nodeParent)
    if (node.textContent === null) {
      throw new Error("can't compute width of html node")
    }
    return this._canvasContext.measureText(node.textContent).width
  }

  computeHtmlElementWidth (element: HTMLElement): number {
    this._canvasContext.font = this._getFontFromElement(element)
    return this._canvasContext.measureText(element.innerText).width
  }

  computeLineHeight (line: HTMLElement): number {
    return line.offsetHeight
  }

  computeLineWidth (line: HTMLElement): number {
    let lineWidth: number = 0
    for (let i = 0; i < line.children.length; i++) {
      lineWidth += (line.children[i] as HTMLElement).offsetWidth
    }
    return lineWidth
  }

  convertDisplayXToX (line: HTMLElement, displayX: number): number {
    const { child, childX, childDisplayX } = this._getChildOnDisplayX(line, displayX)
    return this._getXOnElement(child, childDisplayX, displayX) + childX
  }

  convertDisplayYToY (lines: HTMLElement[][], displayY: number): { y: number, partY: number } {
    let lineDisplayY: number = 0

    for (let i = 0; i < lines.length; i++) {
      for (let l = 0; l < lines[i].length; l++) {
        const lineHeight = this.computeLineHeight(lines[i][l])
        if (displayY >= lineDisplayY && displayY <= lineDisplayY + lineHeight) {
          return { y: i, partY: l }
        }
        lineDisplayY += lineHeight
      }
    }

    return { y: lines.length - 1, partY: lines[lines.length - 1].length - 1 }
  }

  convertXToDisplayX (line: HTMLElement, x: number): number {
    if (line.innerText.length === 0 || x === 0) {
      return 0
    }

    const { child, childOffset } = this._getChildOnX(line, x)

    this._canvasContext.font = this._getFontFromElement(child)
    const computedPosition = child.getBoundingClientRect().left - this._contextPoint.x + this._canvasContext.measureText(child.innerText.slice(0, x - childOffset)).width

    // console.log(`x: ${Math.ceil(computedPosition)}`)
    return Math.ceil(computedPosition)
  }

  convertYToDisplayY (lines: HTMLElement[][], y: number, linePartY: number): number {
    let displayY: number = 0

    for (let i = 0; i < y; i++) {
      for (let l = 0; l < lines[i].length; l++) {
        displayY += this.computeLineHeight(lines[i][l])
      }
    }

    for (let i = 0; i < linePartY; i++) {
      displayY += this.computeLineHeight(lines[y][i])
    }

    return displayY
  }

  splitElementByDisplayWidth (element: HTMLElement, partDisplayWidth: number): IElementSplit[] {
    const elementSplits: ElementSplitsManager = new ElementSplitsManager()
    let childOffset: number = 0
    let splitPosition: number = partDisplayWidth

    for (let i = 0; i < element.children.length; i++) {
      const child: HTMLElement = element.children[i] as HTMLElement
      const childWidth: number = this.computeHtmlElementWidth(child)

      if (childOffset + childWidth >= splitPosition) {
        elementSplits.addSplit()

        const {
          child: endChild,
          childX: endChildX,
          childDisplayX: endChildDisplayX
        } = this._getChildOnDisplayX(child, splitPosition, 0, (childX: number) => elementSplits.addRoute(childX))

        elementSplits.addTextSplitX(this._getXOnElement(endChild, endChildDisplayX, splitPosition) + endChildX)
        splitPosition += splitPosition
      }

      childOffset += childWidth
    }

    return elementSplits.splits
  }

  normalizeDisplayPoint (displayPoint: Point): Point {
    return displayPoint.reset(
      displayPoint.x - this._contextPoint.x,
      displayPoint.y - this._contextPoint.y
    )
  }
}

export { MeasureHtmlTool }
