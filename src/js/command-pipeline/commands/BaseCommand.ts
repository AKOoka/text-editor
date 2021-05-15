import { ITextEditor } from '../../core/ITextEditor'

abstract class BaseCommand {
  protected readonly _toBeSaved: boolean

  constructor (toBeSaved: boolean) {
    this._toBeSaved = toBeSaved
  }

  toBeSaved (): boolean {
    return this._toBeSaved
  }

  abstract do (context: ITextEditor): void
  abstract undo (context: ITextEditor): void
}

export { BaseCommand }
