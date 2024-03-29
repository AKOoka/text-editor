import { Range } from '../common/Range'
import { NodeRepresentation } from '../core/TextRepresentation/Nodes/NodeRepresentation'
import { HtmlCreator } from './HtmlCreator'

export class TextAreaContext {
  protected readonly _htmlContext: HTMLElement
  protected readonly _layerTextHtmlContext: HTMLElement
  protected readonly _layerSelectionHtmlContext: HTMLElement
  protected readonly _htmlCreator: HtmlCreator
  protected readonly _lines: HTMLElement[][]
  protected _lineBoundaries: Range

  constructor () {
    this._htmlContext = this._createHtmlContext()
    this._layerTextHtmlContext = this._createLayerHtmlContext('pre', 'layer-text')
    this._layerSelectionHtmlContext = this._createLayerHtmlContext('div', 'layer-selection')
    this._htmlContext.append(this._layerTextHtmlContext, this._layerSelectionHtmlContext)
    this._htmlCreator = new HtmlCreator()
    this._lines = []
  }

  private _createHtmlContext (): HTMLElement {
    const htmlContext: HTMLElement = document.createElement('div')

    htmlContext.classList.add('text-area')

    return htmlContext
  }

  private _createLayerHtmlContext (htmlTag: keyof HTMLElementTagNameMap, layerClassName: string): HTMLElement {
    const htmlContext: HTMLElement = document.createElement(htmlTag)

    htmlContext.classList.add(layerClassName)

    return htmlContext
  }

  init (): void {
    this._lineBoundaries = new Range(0, this._htmlContext.offsetWidth)
  }

  getHtmlContext (): HTMLElement {
    return this._htmlContext
  }

  createHtmlElement (tag: keyof HTMLElementTagNameMap): HTMLElement {
    return this._htmlCreator.createHtmlElement(tag)
  }

  createHtmlFromNodeRepresentation (lineRepresentation: NodeRepresentation): HTMLElement {
    return this._htmlCreator.createHtmlFromNodeRepresentation(lineRepresentation)
  }

  addLine (y: number, lineParts: HTMLElement[]): void {
    let insertBefore: HTMLElement | null = null
    if (this._lines[y] !== undefined) {
      insertBefore = this._lines[y][0]
    }
    for (const part of lineParts) {
      this._layerTextHtmlContext.insertBefore(part, insertBefore)
    }
    this._lines.splice(y, 0, lineParts)
  }

  addNodeToLinePartEnd (y: number, linePartY: number, node: HTMLElement): void {
    this._lines[y][linePartY].append(node)
  }

  changeLine (y: number, lineParts: HTMLElement[]): void {
    const lineSizeDifference: number = lineParts.length - this._lines[y].length
    const replaceUntil = lineParts.length > this._lines[y].length ? this._lines[y].length : lineParts.length
    let i: number = 0

    for (i; i < replaceUntil; i++) {
      this._lines[y][i].replaceWith(lineParts[i])
    }

    if (lineSizeDifference > 0) {
      this._layerTextHtmlContext.insertBefore(
        lineParts[i],
        this._lines[y + 1] !== undefined ? this._lines[y + 1][0] : null
      )
      for (++i; i < lineParts.length; i++) {
        this._layerTextHtmlContext.insertBefore(lineParts[i], lineParts[i - 1])
      }
    } else {
      for (i; i < this._lines[y].length; i++) {
        this._lines[y][i].remove()
      }
    }

    this._lines[y] = lineParts
  }

  deleteLine (y: number): void {
    for (const linePart of this._lines[y]) {
      linePart.remove()
    }
    this._lines.splice(y, 1)
  }

  addTextCursor (textCursorContext: HTMLElement): void {
    this._layerSelectionHtmlContext.append(textCursorContext)
  }

  addSelection (selectionContext: HTMLElement): void {
    this._layerSelectionHtmlContext.append(selectionContext)
  }
}
