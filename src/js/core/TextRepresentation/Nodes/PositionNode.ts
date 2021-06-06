class PositionNode {
  private _offset: number
  private _position: number

  constructor (offset: number, position: number) {
    this._offset = offset
    this._position = position
  }

  get offset (): number {
    return this._offset
  }

  get position (): number {
    return this._position - this._offset
  }

  get initPosition (): number {
    return this._position
  }

  reset (offset: number, position: number): PositionNode {
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

export { PositionNode }
