export class HtmlElementPool {
  private readonly _pool: HTMLElement[]

  constructor (size: number = 0) {
    this._pool = []

    for (let i = 0; i < size; i++) {
      this._pool.push()
    }
  }

  getNode (): HTMLElement {
    return document.createElement('span')
  }

  getTextLine (): HTMLElement {
    return document.createElement('div')
  }
}
