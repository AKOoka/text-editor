import { Point } from '../common/Point'

export interface ITextArea {
  getInteractiveLayerContext: () => HTMLElement
  convertDisplayPointToPoint: (displayPoint: Point) => Point
  showInteractiveElement: (displayPoint: Point, element: HTMLElement, normalize?: boolean) => void
}
