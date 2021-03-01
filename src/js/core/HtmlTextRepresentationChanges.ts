import { TextRepresentationChangeType } from '../common/TextRepresentationChangeType'
import { INode } from './INode'

type LineChanges = Map<number, {
  line?: INode<HTMLElement>
  lineOffset: number
  lineChangeType: TextRepresentationChangeType
}>

interface IRenderedLineChange {
  line: HTMLElement
  linePosition: number
  lineChangeType: TextRepresentationChangeType
}

class HtmlTextRepresentationChanges {
  private readonly _lineChanges: LineChanges
  private _renderedLines: IRenderedLineChange[]

  constructor () {
    this._lineChanges = new Map()
    this._renderedLines = []
  }

  renderLines (): void {
    this._renderedLines = []
    for (const [linePosition, { line, lineOffset, lineChangeType }] of this._lineChanges.entries()) {
      this._renderedLines.push({
        line: line === undefined ? document.createElement('div') : line.render(),
        linePosition: linePosition + lineOffset,
        lineChangeType
      })
    }
  }

  addChange (lineOffset: number, linePosition: number, lineChangeType: TextRepresentationChangeType, line?: INode<HTMLElement>): void {
    // if (this._lineChanges.has(linePosition)) {
    //   return
    // }
    this._lineChanges.set(linePosition, { line, lineOffset, lineChangeType })
  }

  getSize (): number {
    return this._renderedLines.length
  }

  getLine (index: number): IRenderedLineChange {
    return this._renderedLines[index]
  }
}

export { HtmlTextRepresentationChanges }
