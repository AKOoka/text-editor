export interface IElementSplit {
  route: number[]
  textSplitX: number
}

export class ElementSplitsManager {
  private readonly _splits: IElementSplit[]

  constructor () {
    this._splits = []
  }

  get splits (): IElementSplit[] {
    return this._splits
  }

  addSplit (): void {
    this._splits.push({ route: [], textSplitX: 0 })
  }

  addRoute (route: number): void {
    this._splits[this._splits.length - 1].route.push(route)
  }

  addTextSplitX (x: number): void {
    this._splits[this._splits.length - 1].textSplitX = x
  }

  static CompareRoutes (routeFirst: number[], routeSecond: number[]): boolean {
    return routeFirst.every((v, i) => v === routeSecond[i])
  }
}
