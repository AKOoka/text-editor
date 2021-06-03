import { BaseTextAreaLayer } from './BaseTextAreaLayer'

class TextAreaLayerText extends BaseTextAreaLayer {
  private readonly _textLines: HTMLElement[]

  constructor () {
    super()
    this._context.classList.add('text-area_layer-text')
    this._textLines = []
  }

  insertTextLine (y: number, line: HTMLElement): void {
    this._context.insertBefore(line, this._textLines[y])
    this._textLines.splice(y, 0, line)
  }

  deleteTextLine (y: number): void {
    this._textLines[y].remove()
    this._textLines.splice(y, 1)
  }

  getTextLine (y: number): HTMLElement {
    return this._textLines[y]
  }

  getAllTextLines (): HTMLElement[] {
    return this._textLines
  }

  private _getChildNodeFromRoute (y: number, route: number[]): HTMLElement {
    let currentNode: HTMLElement = this._textLines[y]
    for (const r of route) {
      currentNode = currentNode.children[r] as HTMLElement
    }
    return currentNode
  }

  deleteNode (y: number, routeToNode: number[]): void {
    this._getChildNodeFromRoute(y, routeToNode).remove()
  }

  addNode (y: number, routeToNode: number[], node: HTMLElement): void {
    let currentNode = this._textLines[y]
    for (let i = 0; i < routeToNode.length - 1; i++) {
      currentNode = currentNode.children[routeToNode[i]] as HTMLElement
    }
    currentNode.insertBefore(node, currentNode.children[routeToNode[routeToNode.length - 1]])
  }

  changeNode (y: number, routeToNode: number[], nodes: HTMLElement[]): void {
    this._getChildNodeFromRoute(y, routeToNode).replaceWith(...nodes)
  }
}

export { TextAreaLayerText }
