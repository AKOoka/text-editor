import { ITextEditor } from '../core/ITextEditor'

export interface ICommand {
  toBeSaved: () => boolean
  do: (context: ITextEditor) => void
  undo: (context: ITextEditor) => void
}
