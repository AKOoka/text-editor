import { IPoint } from '../common/IPoint'

export interface ITextArea {
  getInteractiveLayerContext: () => HTMLElement
  convertToTextPosition: (displayPosition: IPoint) => IPoint
  showElementOnInteractiveLayer: (displayPosition: IPoint, element: HTMLElement) => void
}
