import { TextStyleType } from './TextStyleType'

export interface IActiveTextStylesSubscriber {
  updateActiveTextStyles: (activeTextStyles: TextStyleType[]) => void
}
