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

  copy (): RangeNode {
    return new RangeNode(this._offset, this._start, this._end)
  }

  reset (offset: number, start: number, end: number): RangeNode {
    this._offset = offset
    this._start = start
    this._end = end
    return this
  }

  childNodeInRange (nodeOffset: number, nodeSize: number): boolean {
    const rightEdge: number = nodeOffset + nodeSize

    return (
      ((this._start >= nodeOffset && this._start <= rightEdge) && !(this._start === rightEdge && this._end >= rightEdge)) ||
      ((this._end >= nodeOffset && this._end <= rightEdge) && !(this._end === nodeOffset && this._start <= nodeOffset)) ||
      (this._start <= nodeOffset && this._end >= rightEdge)
    )
  }

  nodeInRange (nodeSize: number): boolean {
    const rightEdge: number = this._offset + nodeSize
    return (this._start >= this._offset && this._start <= rightEdge) ||
           (this._end >= this._offset && this._end <= rightEdge)
  }

  nodeInsideRange (nodeSize: number): boolean {
    return this._start <= this._offset && this._end >= this._offset + nodeSize
  }

  rangeInsideNode (nodeSize: number): boolean {
    return this._start > this._offset && this._end < this._offset + nodeSize
  }

  nodeStartInRange (nodeSize: number): boolean {
    return this._start > this._offset && this._start < this._offset + nodeSize
  }

  nodeEndInRange (nodeSize: number): boolean {
    return this._end > this._offset && this._end < this._offset + nodeSize
  }
}

export { RangeNode }
