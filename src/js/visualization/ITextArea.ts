export interface ITextArea {
  getInteractiveLayerContext: () => HTMLElement
  getTextPosition: (displayX: number, displayY: number) => { x: number, y: number }
}
