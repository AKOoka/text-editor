interface SearchChildResult {
  child: Node
  childOffset: number
  elementsBeforeChild: Node[]
}

class MeasureHtmlTool {
  private readonly _ctx: CanvasRenderingContext2D
  private _contextFont: string

  constructor (textAreaContext: HTMLElement) {
    const ctx = document.createElement('canvas').getContext('2d')
    if (ctx === null) {
      throw new Error("can't create canvas context 2d")
    }

    this._ctx = ctx

    window.onload = () => {
      this._contextFont = this._getFontFromElement(textAreaContext)
      this._ctx.font = this._contextFont
      console.log(this._contextFont)
    }
  }

  private _getFontFromElement (htmlElement: HTMLElement): string {
    const font = window.getComputedStyle(htmlElement)
    return `${font.getPropertyValue('font-size')} ${font.getPropertyValue('font-family')}`
  }

  private _getChildNodeOnPosition (childNodes: NodeListOf<ChildNode>, position: number): SearchChildResult {
    const elementsBeforeChild: Node[] = []
    let offset: number = 0

    for (let i = 0; i < childNodes.length; i++) {
      const childNode = childNodes[i]

      // for now i don't use elementsBeforeChild, only first element
      elementsBeforeChild.push(childNode)

      if (childNode.textContent === null) {
        continue
      }

      if (position >= offset && position <= offset + childNode.textContent.length) {
        return {
          child: childNode,
          childOffset: offset,
          elementsBeforeChild
        }
      }

      offset += childNode.textContent.length
    }

    throw new Error(`no child in text line on ${position}`)
  }

  computePositionInTextLine (childNodes: NodeListOf<ChildNode>, position: number): number {
    const { elementsBeforeChild } = this._getChildNodeOnPosition(childNodes, position)
    let computedPosition: number = 0

    for (const element of elementsBeforeChild) {
      if (element.textContent === null) {
        continue
      }

      this._ctx.font =
        element.nodeType === Node.ELEMENT_NODE
          ? this._getFontFromElement(element as HTMLElement)
          : this._contextFont

      computedPosition += this._ctx.measureText(element.textContent).width
    }
    return computedPosition
  }
}

export { MeasureHtmlTool }
