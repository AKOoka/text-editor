class TextAreaTextLine {
  private readonly _context: HTMLElement

  constructor (context: HTMLElement) {
    this._context = context
  }

  getContext (): HTMLElement {
    return this._context
  }

  remove (): void {
    this._context.remove()
    for (let i = 0; i < this._context.childNodes.length; i++) {
      this._context.childNodes[i].remove()
    }
  }

  appendChild (child: Node): void {
    this._context.append(child)
  }

  removeChild (child: Node): void {
    this._context.removeChild(child)
  }

  getChildren (): NodeListOf<ChildNode> {
    return this._context.childNodes
  }
}

export { TextAreaTextLine }
