import { TextStyle } from './TextStyle'

export interface IActiveTextStylesSubscriber {
  updateActiveTextStyles: (activeTextStyles: TextStyle[]) => void
}
