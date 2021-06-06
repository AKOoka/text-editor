import { NodeUpdatesManager } from './Nodes/NodeUpdatesManager'
import { TextEditorRepresentationUpdateLineType } from './TextEditorRepresentationUpdateManager'

interface ILineUpdate {
  type: TextEditorRepresentationUpdateLineType
  nodeUpdatesManager?: NodeUpdatesManager
}

export class LineUpdates {
  private readonly _offset: number
  private readonly _updates: ILineUpdate[]

  constructor (offset: number, update: ILineUpdate[] = []) {
    this._offset = offset
    this._updates = update
  }

  get offset (): number {
    return this._offset
  }

  get updates (): ILineUpdate[] {
    return this._updates
  }

  addUpdate (update: ILineUpdate): void {
    this._updates.push(update)
  }
}
