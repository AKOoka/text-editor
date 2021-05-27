import { IPoint } from '../common/IPoint'

export interface ITextArea {
  getInteractiveLayerContext: () => HTMLElement
  getTextPosition: (displayPoint: IPoint) => IPoint
  showElementOnInteractiveLayer: (displayPoint: IPoint, element: HTMLElement) => void
}
