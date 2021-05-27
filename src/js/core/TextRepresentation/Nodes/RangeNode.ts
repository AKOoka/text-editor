class RangeNode {
  private _offset: number
  private _start: number
  private _end: number

  constructor (offset: number, start: number, end: number) {
    this._offset = offset
    this._start = start
    this._end = end
  }

  get offset (): number {
    return this._offset
  }

  get start (): number {
    return this._start - this._offset
  }

  get initStart (): number {
    return this._start
  }

  get end (): number {
    return this._end - this._offset
  }

  get initEnd (): number {
    return this._end
  }

  reset (offset: number, start: number, end: number): void {
    this._offset = offset
    this._start = start
    this._end = end
  }

  childNodeInRange (nodeOffset: number, nodeSize: number): boolean {
    const rightEdge: number = nodeOffset + nodeSize

    return (((this._start >= nodeOffset && this._start <= rightEdge) && !(this._start === rightEdge && this._end >= rightEdge)) ||
      ((this._end >= nodeOffset && this._end <= rightEdge) && !(this._end === nodeOffset && this._start <= nodeOffset)))
  }

  nodeInRange (nodeSize: number): boolean {
    return (this._start >= this._offset && this._start <= this._offset + nodeSize) ||
           (this._end >= this._offset && this._end <= this._offset + nodeSize)
  }

  nodeInsideRange (nodeSize: number): boolean {
    return this._start <= 0 && this._end >= nodeSize
  }

  rangeInsideNode (nodeSize: number): boolean {
    return this._start > 0 && this._end < nodeSize
  }

  nodeStartInRange (nodeSize: number): boolean {
    return this._start > 0 && this._start < nodeSize
  }

  nodeEndInRange (nodeSize: number): boolean {
    return this._end > 0 && this._end < nodeSize
  }
}

export { RangeNode }
