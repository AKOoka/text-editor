export class PositionWithOffset {
  private _offset: number
  private _position: number

  constructor (position: number, offset: number) {
    this._position = position
    this._offset = offset
  }

  get offset (): number {
    return this._offset
  }

  get positionWithOffset (): number {
    return this._position - this._offset
  }

  get position (): number {
    return this._position
  }

  copy (): PositionWithOffset {
    return new PositionWithOffset(this._position, this._offset)
  }

  reset (position: number, offset: number): PositionWithOffset {
    this._position = position
    this._offset = offset
    return this
  }

  nodeInPosition (offset: number, nodeSize: number): boolean {
    return (this._position >= offset && this._position <= offset + nodeSize)
  }

  childNodeInPosition (nodeOffset: number, nodeSize: number): boolean {
    const rightEdge: number = nodeOffset + nodeSize

    return (((this._position >= nodeOffset && this._position <= rightEdge) && !(this._position === rightEdge && this._position >= rightEdge)) ||
      ((this._position >= nodeOffset && this._position <= rightEdge) && !(this._position === nodeOffset && this._position <= nodeOffset)))
  }
}
