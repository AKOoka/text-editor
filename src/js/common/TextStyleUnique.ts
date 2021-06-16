import { TextStyle } from './TextStyle'

export class TextStyleUnique extends TextStyle {
  compare (textStyle: TextStyle): boolean {
    return this.value === textStyle.value && this.compare(textStyle)
  }
}
