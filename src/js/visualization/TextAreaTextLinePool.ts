import { TextAreaTextLine } from './TextAreaTextLine'

class TextAreaTextLinePool {
  private _pool: TextAreaTextLine[]

  constructor () {
    this._pool = []
  }

  addTextLine (linePosition: number, line: HTMLElement): void {
    this._pool = this._pool
      .slice(0, linePosition)
      .concat(new TextAreaTextLine(line), this._pool.slice(linePosition))
  }

  removeTextLine (linePosition: number): void {
    this._pool[linePosition].remove()
  }

  changeTextLine (linePosition: number, line: HTMLElement): void {
    this._pool[linePosition].getContext().replaceWith(line)
    this._pool = this._pool
      .slice(0, linePosition)
      .concat(new TextAreaTextLine(line), this._pool.slice(linePosition + 1))
  }

  getTextLineContext (linePosition: number): HTMLElement {
    // for now pool isn't as planned so I temporally add '?' so program will work
    return this._pool[linePosition]?.getContext()
  }

  getTextLineChildren (linePosition: number): NodeListOf<ChildNode> {
    return this._pool[linePosition].getChildren()
  }

  appendChildToLine (linePosition: number, child: Node): void {
    this._pool[linePosition].appendChild(child)
  }
}

export { TextAreaTextLinePool }
