import { IPoint } from '../common/IPoint'

export interface ITextArea {
  getInteractiveLayerContext: () => HTMLElement
  convertDisplayPosition: (displayPosition: IPoint) => IPoint
  showInteractiveElement: (displayPosition: IPoint, element: HTMLElement) => void
}
