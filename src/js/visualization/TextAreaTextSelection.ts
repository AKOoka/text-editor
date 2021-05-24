// may here i will get htmlElement from pool and pool be used only here

class TextAreaTextSelection {
  private _startY: number
  private _endY: number
  private _selectionParts: HTMLElement[]

  constructor (startY: number, endY: number) {
    this._startY = startY
    this._endY = endY
    this._selectionParts = this._createSelectionParts(startY, endY)
  }

  private _createHtmlElement (): HTMLElement {
    const htmlElement = document.createElement('div')
    htmlElement.classList.add('text-selection')
    return htmlElement
  }

  private _createSelectionParts (startY: number, endY: number): HTMLElement[] {
    const htmlElementPool: HTMLElement[] = []

    for (let i = 0; i <= endY - startY; i++) {
      htmlElementPool.push(this._createHtmlElement())
    }

    return htmlElementPool
  }

  getStartY (): number {
    return this._startY
  }

  setStartY (y: number): void {
    // if (y > this.getStartY()) {
    //
    // } else if (y < this.getStartY()) {
    //
    // }
    this._startY = y
  }

  getEndY (): number {
    return this._endY
  }

  setEndY (y: number): void {
    // if (y < this.getEndY()) {
    //
    // } else if (y > this.getEndY()) {
    //
    // }
    this._endY = y
  }

  getParts (): HTMLElement[] {
    return this._selectionParts
  }

  remove (): void {
    for (const selectionPart of this._selectionParts) {
      selectionPart.remove()
    }
    this._selectionParts = []
  }
}

export { TextAreaTextSelection }
