import { IPoint } from '../common/IPoint'

interface ISearchChildResult {
  child: HTMLElement
  childOffset: number
}

class MeasureHtmlTool {
  private readonly _canvasContext: CanvasRenderingContext2D
  private _contextPosition: IPoint
  private _contextFont: string

  constructor () {
    const ctx = document.createElement('canvas').getContext('2d')
    if (ctx === null) {
      throw new Error("can't create canvas context 2d")
    }
    this._contextPosition = { x: 0, y: 0 }
    this._canvasContext = ctx
  }

  setContext (textAreaContext: HTMLElement): void {
    this._contextPosition.x = textAreaContext.getBoundingClientRect().x
    this._contextPosition.y = textAreaContext.getBoundingClientRect().y
    this._contextFont = this._getFontFromElement(textAreaContext)
    this._canvasContext.font = this._contextFont
    console.log(`text area font: ${this._contextFont}\ncontext x: ${this._contextPosition.x}; y: ${this._contextPosition.y}`)
  }

  private _getFontFromElement (htmlElement: HTMLElement): string {
    const font = window.getComputedStyle(htmlElement)
    return `${font.getPropertyValue('font-size')} ${font.getPropertyValue('font-family')}`
  }

  private _getChildOnPosition (parent: HTMLElement, x: number): ISearchChildResult {
    let childOffset: number = 0

    for (let i = 0; i < parent.children.length; i++) {
      const child: HTMLElement = parent.children[i] as HTMLElement

      if (x >= childOffset && x <= childOffset + child.innerText.length) {
        const result = this._getChildOnPosition(child, x)
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

  computePositionX (line: HTMLElement, x: number): number {
    if (line.innerText.length === 0 || x === 0) {
      return 0
    }

    const { child, childOffset } = this._getChildOnPosition(line, x)

    this._canvasContext.font =
      child.nodeType === Node.ELEMENT_NODE
        ? this._getFontFromElement(child)
        : this._contextFont
    const computedPosition = child.getBoundingClientRect().left - this._contextPosition.x + this._canvasContext.measureText(child.innerText.slice(0, x - childOffset)).width

    // console.log(`x: ${Math.ceil(computedPosition)}`)
    return Math.ceil(computedPosition)
  }

  computePositionY (lines: HTMLElement[], y: number): number {
    let computedPosition: number = 0
    for (let i = 0; i < y; i++) {
      computedPosition += lines[i].offsetHeight
    }
    return computedPosition
  }

  computeLineHeight (line: HTMLElement): number {
    return line.offsetHeight
  }

  private _getLineOnDisplayY (lines: HTMLElement[], displayY: number): number {
    let lineDisplayY: number = 0

    for (let i = 0; i < lines.length; i++) {
      const curLineDisplayY: number = lineDisplayY + this.computeLineHeight(lines[i])
      if (displayY >= lineDisplayY && displayY <= curLineDisplayY) {
        return i
      }
      lineDisplayY += this.computeLineHeight(lines[i])
    }

    return lines.length - 1
  }

  private _getTextPositionOnDisplayX (line: HTMLElement, displayX: number): number {
    const { child, childDisplayX } = this._getChildOnDisplayX(line, displayX)
    let startDisplayX: number = childDisplayX
    this._canvasContext.font =
      child.nodeType === Node.ELEMENT_NODE
        ? this._getFontFromElement(child)
        : this._contextFont

    for (let i = 0; i < child.innerText.length; i++) {
      const textWidth: number = this._canvasContext.measureText(child.innerText[i]).width

      if (displayX >= startDisplayX && displayX <= startDisplayX + textWidth) {
        return i
      }

      startDisplayX += textWidth
    }

    return child.innerText.length
  }

  private _getChildOnDisplayX (parent: HTMLElement, displayX: number): { child: HTMLElement, childDisplayX: number } {
    for (let i = 0; i < parent.children.length; i++) {
      const child: HTMLElement = parent.children[i] as HTMLElement

      if (displayX >= child.offsetLeft && displayX <= child.offsetLeft + child.offsetWidth) {
        return this._getChildOnDisplayX(child, displayX)
      }
    }

    return { child: parent, childDisplayX: parent.offsetLeft }
  }

  normalizeDisplayPosition (displayPosition: IPoint): IPoint {
    return {
      x: displayPosition.x - this._contextPosition.x,
      y: displayPosition.y - this._contextPosition.y
    }
  }

  convertDisplayPosition (lines: HTMLElement[], displayPosition: IPoint): IPoint {
    const y: number = this._getLineOnDisplayY(lines, displayPosition.y - this._contextPosition.y)
    const x: number = this._getTextPositionOnDisplayX(lines[y], displayPosition.x - this._contextPosition.x)

    return { x, y }
  }
}

export { MeasureHtmlTool }
