import { AddTextCommand } from '../command-pipeline/commands/AddTextCommand'
import { BaseKeyHandler } from './BaseKeyHandler'

class TypeKeysHandler extends BaseKeyHandler {
  handleEvent (event: KeyboardEvent): void {
    this._commandDispatcher.doCommand(new AddTextCommand(event.key, false))
  }
}

export { TypeKeysHandler }
