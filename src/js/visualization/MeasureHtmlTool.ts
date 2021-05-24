interface SearchChildResult {
  child: HTMLElement
  childOffset: number
}

class MeasureHtmlTool {
  private readonly _canvasContext: CanvasRenderingContext2D
  private _contextX: number
  private _contextFont: string

  constructor () {
    const ctx = document.createElement('canvas').getContext('2d')
    if (ctx === null) {
      throw new Error("can't create canvas context 2d")
    }
    this._canvasContext = ctx
  }

  setContext (textAreaContext: HTMLElement): void {
    this._contextX = textAreaContext.getBoundingClientRect().x
    this._contextFont = this._getFontFromElement(textAreaContext)
    this._canvasContext.font = this._contextFont
    console.log(`text area font: ${this._contextFont}\ncontext x: ${this._contextX}`)
  }

  private _getFontFromElement (htmlElement: HTMLElement): string {
    const font = window.getComputedStyle(htmlElement)
    return `${font.getPropertyValue('font-size')} ${font.getPropertyValue('font-family')}`
  }

  private _getChildOnPosition (parent: HTMLElement, x: number): SearchChildResult {
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
      childOffset
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
    const computedPosition = child.getBoundingClientRect().left - this._contextX + this._canvasContext.measureText(child.innerText.slice(0, x - childOffset)).width

    console.log(`x: ${Math.ceil(computedPosition)}`)
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
}

export { MeasureHtmlTool }
