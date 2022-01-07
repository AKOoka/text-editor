import { Range } from '../../../../common/Range'

export class RangeWithOffset extends Range {
  private _offset: number

  constructor (start: number, end: number, offset: number) {
    super(start, end)
    this._offset = offset
  }

  get offset (): number {
    return this._offset
  }

  get startWithOffset (): number {
    return this._start - this._offset
  }

  get endWithOffset (): number {
    return this._end - this._offset
  }

  copy (): RangeWithOffset {
    return new RangeWithOffset(this._start, this._end, this._offset)
  }

  reset (start: number, end: number, offset: number): RangeWithOffset {
    this._start = start
    this._end = end
    this._offset = offset
    return this
  }

  setOffset (offset: number): RangeWithOffset {
    this._offset = offset
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

  isNodeInRange (nodeSize: number): boolean {
    const nodeEnd: number = this._offset + nodeSize
    return (this._start >= this._offset && this._start <= nodeEnd) ||
           (this._end >= this._offset && this._end <= nodeEnd)
  }

  isNodeInsideRange (nodeSize: number): boolean {
    return this._start <= this._offset && this._end >= this._offset + nodeSize
  }

  isRangeInsideNode (nodeSize: number): boolean {
    return this._start > this._offset && this._end < this._offset + nodeSize
  }

  isNodeStartInRange (nodeSize: number): boolean {
    return this._start > this._offset && this._start < this._offset + nodeSize
  }

  isNodeEndInRange (nodeSize: number): boolean {
    return this._end > this._offset && this._end < this._offset + nodeSize
  }

  getNodeWidthInRange (nodeSize: number): number {
    const start: number = this._offset > this._start ? this.offset : this._start
    const end: number = this._offset + nodeSize > this._end ? this._end : this._offset + nodeSize

    return end - start
  }
}
