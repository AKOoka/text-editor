import { Point } from '../common/Point'

export interface IHtmlMeasurer {
  convertDisplayPointToPoint: (displayPoint: Point) => Point
  translatePoint: (point: Point, offsetY: number) => Point
}
