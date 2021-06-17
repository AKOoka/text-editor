import { Point } from '../common/Point'

export interface ITextArea {
  getInteractiveLayerContext: () => HTMLElement
  convertDisplayPosition: (displayPosition: Point) => Point
  showInteractiveElement: (displayPosition: Point, element: HTMLElement) => void
}
