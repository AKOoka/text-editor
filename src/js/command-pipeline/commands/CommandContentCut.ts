import { Point } from '../../common/Point'
import { Selection } from '../../common/Selection'
import { ITextEditor } from '../../core/ITextEditor'
import { INodeCopy } from '../../core/TextRepresentation/Nodes/INode'
import { BaseCommand } from './BaseCommand'

export class CommandContentCut extends BaseCommand {
  private readonly _from: Selection
  private readonly _to: Point
  private _content: INodeCopy[]

  constructor (toBeSaved: boolean, from: Selection, to: Point) {
    super(toBeSaved)
    this._from = from
    this._to = to
  }

  do (context: ITextEditor): void {
    this._content = context.getContentInSelections([this._from])
    context.deleteTextInRange(this._from.rangeY.start, this._from.rangeX)
    if (this._from.rangeY.width > 0) {
      context.deleteLinesInRange(this._from.rangeY)
    }
    context.addContent(this._to, this._content)
  }

  undo (): void {
    console.log('cut undo')
  }
}
