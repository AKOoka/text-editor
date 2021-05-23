interface SearchChildResult {
  child: Node
  childOffset: number
  elementsBeforeChild: Node[]
}

interface SearchChildrenResult {
  children: Node[]
  childrenOffset: number
  elementsBeforeChildren: Node[]
}

class MeasureHtmlTool {
  // private readonly _ctx: CanvasRenderingContext2D
  // private readonly _contextFont: string
  //
  // constructor (textAreaContext: HTMLElement) {
  //   const ctx = document.createElement('canvas').getContext('2d')
  //   if (ctx === null) {
  //     throw new Error("can't create canvas context 2d")
  //   }
  //
  //   this._ctx = ctx
  //   this._contextFont = this._getFontFromElement(textAreaContext)
  //   this._ctx.font = this._contextFont
  // }

  // private _getFontFromElement (htmlElement: HTMLElement): string {
  //   const font = window.getComputedStyle(htmlElement)
  //   return `${font.getPropertyValue('font-size')} ${font.getPropertyValue('font-family')}`
  // }

  private readonly _range: Range

  constructor () {
    this._range = document.createRange()
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

  private _getChildNodesOnRange (childNodes: NodeListOf<ChildNode>, start: number, end: number): SearchChildrenResult {
    const searchResult: SearchChildrenResult = {
      children: [],
      childrenOffset: 0,
      // for now i don't use elementsBeforeChild
      elementsBeforeChildren: []
    }
    for (let i = 0; i < childNodes.length; i++) {
      const childNode = childNodes[i]
      let offset: number = 0

      searchResult.elementsBeforeChildren.push(childNode)

      if (childNode.textContent === null) {
        continue
      }

      const childNodeEnd: number = offset + childNode.textContent.length

      if ((start >= offset && start <= childNodeEnd) && (end >= offset && end <= childNodeEnd)) {
        if (searchResult.children.length === 0) {
          searchResult.childrenOffset = offset
        }
        searchResult.children.push(childNode)
      } else if (searchResult.children.length > 0) {
        break
      }

      offset += childNode.textContent.length
    }

    return searchResult
  }

  computePositionInTextLine (childNodes: NodeListOf<ChildNode>, position: number): number {
    // const { child, childOffset, elementsBeforeChild } = this._getChildNodeOnPosition(childNodes, position)
    // let computedPosition: number = 0
    //
    // for (const element of elementsBeforeChild) {
    //   if (element.textContent === null) {
    //     continue
    //   }
    //
    //   this._ctx.font =
    //     element.nodeType === Node.ELEMENT_NODE
    //       ? this._getFontFromElement(element as HTMLElement)
    //       : this._contextFont
    //
    //   computedPosition += this._ctx.measureText(element.textContent).width
    // }
    // return computedPosition

    const { child, childOffset } = this._getChildNodeOnPosition(childNodes, position)
    const pos: number = position - childOffset
    this._range.setStart(child, pos)
    this._range.setEnd(child, pos)
    return this._range.getBoundingClientRect().x
  }

  computeRangeInTextLine (childNodes: NodeListOf<ChildNode>, start: number, end: number): { start: number, end: number } {
    const { children, childrenOffset } = this._getChildNodesOnRange(childNodes, start, end)

    this._range.setStart(children[0], start - childrenOffset)
    this._range.setEnd(children[children.length - 1], end)
    const boundingRect = this._range.getBoundingClientRect()
    return {
      start: boundingRect.left,
      end: boundingRect.right
    }
  }
}

export { MeasureHtmlTool }
