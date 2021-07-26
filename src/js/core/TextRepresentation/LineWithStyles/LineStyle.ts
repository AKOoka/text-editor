import { TextStyle } from '../../../common/TextStyle'
import { Range } from '../../../common/Range'

export class LineStyle {
  private _textStyle: TextStyle
  private _range: Range

  get textStyle (): TextStyle {
    return this._textStyle
  }

  set textStyle (value: TextStyle) {
    this._textStyle = value
  }

  get range (): Range {
    return this._range
  }

  set range (value: Range) {
    this._range = value
  }

  constructor (textStyle: TextStyle, range: Range) {
    this._textStyle = textStyle
    this._range = range
  }

  copy (
    textStyle: TextStyle = this._textStyle,
    range: Range = this._range.copy()
  ): LineStyle {
    return new LineStyle(textStyle, range)
  }

  reset (
    textStyle: TextStyle = this._textStyle,
    range: Range = this._range
  ): LineStyle {
    this._textStyle = textStyle
    this._range = range
    return this
  }

  setTextStyle (textStyle: TextStyle): LineStyle {
    this._textStyle = textStyle
    return this
  }
}
