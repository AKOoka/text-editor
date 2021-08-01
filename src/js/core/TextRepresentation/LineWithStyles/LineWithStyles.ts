import { TextStyle } from '../../../common/TextStyle'
import { ITextEditorRepresentationLine } from '../ITextEditorRepresentationLine'
import { Range } from '../../../common/Range'
import { LineStyle } from './LineStyle'
import { ILineWithStylesContent, LineWithStylesContent } from './LineWithStylesContent'
import { ILineContent } from '../ILineContent'

export class LineWithStyles implements ITextEditorRepresentationLine<ILineWithStylesContent> {
  private _text: string
  private _styles: LineStyle[]

  constructor () {
    this._text = ''
    this._styles = []
  }

  private _sliceTextWithRange (text: string, range: Range): string {
    return text.slice(0, range.start) + text.slice(range.end)
  }

  private _findStartIndexInStyles (position: number): number {
    const i: number = this._styles.findIndex(v => v.range.start >= position || v.range.end >= position)
    return i >= 0 ? i : 0
  }

  getSize (): number {
    return this._text.length
  }

  getContent (): ILineContent {
    return new LineWithStylesContent(this._text, this._styles)
  }

  getContentInRange (range: Range): ILineContent {
    const stylesInRange: LineStyle[] = []
    const startIndex: number = this._styles.findIndex(v => v.range.isRangeIntersects(range))

    for (let i = startIndex >= 0 ? startIndex : 0; i < this._styles.length; i++) {
      const style = this._styles[i]

      if (style.range.isInsideRange(range)) {
        stylesInRange.push(style.copy())
      } else if (style.range.isRangeInside(range)) {
        stylesInRange.push(style.copy(style.textStyle, range.copy()))
      } else if (style.range.isStartInRange(range)) {
        stylesInRange.push(
          style.copy(
            style.textStyle,
            style.range.copy().reset(style.range.start, range.end)
          )
        )
      } else if (style.range.isEndInRange(range)) {
        stylesInRange.push(
          style.copy(
            style.textStyle,
            style.range.copy().reset(range.start, style.range.end)
          )
        )
      } else {
        break
      }
    }

    return new LineWithStylesContent(this._sliceTextWithRange(this._text, range), stylesInRange)
  }

  getTextStylesInRange (range: Range): TextStyle[] {
    const textStyles: TextStyle[] = []

    for (const style of this._styles) {
      if (style.range.isRangeIntersects(range)) {
        textStyles.push(style.textStyle)
      }
    }

    return textStyles
  }

  addText (position: number, text: string): void {
    this._text = this._text.slice(0, position) + text + this._text.slice(position)

    for (let i = this._findStartIndexInStyles(position); i < this._styles.length; i++) {
      if (this._styles[i].range.isOnPosition(position)) {
        this._styles[i].range.end += text.length
      } else {
        this._styles[i].range.translate(text.length)
      }
    }
  }

  deleteText (range: Range): void {
    this._text = this._sliceTextWithRange(this._text, range)

    for (let i = this._findStartIndexInStyles(range.start); i < this._styles.length; i++) {
      const style = this._styles[i]

      if (style.range.isInsideRange(range)) {
        this._styles.splice(i, 1)
      } else if (style.range.isRangeInside(range)) {
        this._styles.splice(
          i,
          1,
          style.copy(style.textStyle, style.range.copy(style.range.start, range.start)),
          style.copy(style.textStyle, style.range.copy(range.end, style.range.end))
        )
      } else if (style.range.isStartInRange(range)) {
        style.range.reset(range.end, style.range.end)
      } else if (style.range.isEndInRange(range)) {
        style.range.reset(style.range.start, range.start)
      } else {
        style.range.translate(-range.width)
      }
    }

    this._styles = this._styles.sort((a, b) => a.range.start - b.range.start)
  }

  addContent (position: number, content: ILineContent): void {
    const { text, styles } = content.getContent()

    this.addText(position, text)

    for (const s of styles) {
      this.addTextStyle(s.range.translate(position), s.textStyle)
    }
  }

  addTextStyle (range: Range, textStyle: TextStyle): void {
    const startIndex: number = this._findStartIndexInStyles(range.start)

    if (startIndex < 0) {
      this._styles.push(new LineStyle(textStyle, range.copy()))
      return
    }

    this._styles.splice(startIndex, 0, new LineStyle(textStyle, range))

    for (let i = startIndex + 1; i < this._styles.length; i++) {
      if (this._styles[i].range.isInsideRange(range)) {
        if (this._styles[i].textStyle.deepCompare(textStyle)) {
          this._styles.splice(i, 1)
        }
      } else if (this._styles[i].range.isRangeInside(range)) {
        if (this._styles[i].textStyle.deepCompare(textStyle)) {
          this._styles.splice(startIndex, 1)
        }
      } else if (this._styles[i].range.isStartInRange(range)) {
        if (this._styles[i].textStyle.deepCompare(textStyle)) {
          range.end = this._styles[i].range.end
        }
      } else {
        return
      }
    }
  }

  deleteTextStyleAll (range: Range): void {
    let i: number = this._findStartIndexInStyles(range.start)

    if (i < 0) {
      return
    }

    for (i; i < this._styles.length; i++) {
      if (this._styles[i].range.isInsideRange(range)) {
        this._styles.splice(i, 1)
      } else if (this._styles[i].range.isRangeInside(range)) {
        const leftPart: LineStyle = this._styles[i].copy()
        const rightPart: LineStyle = this._styles[i].copy()

        leftPart.range.end = range.start
        rightPart.range.start = range.end

        this._styles.splice(i, 1, leftPart, rightPart)
      } else if (this._styles[i].range.isStartInRange(range)) {
        this._styles[i].range.start = range.end
      } else if (this._styles[i].range.isEndInRange(range)) {
        this._styles[i].range.end = range.start
      } else {
        return
      }
    }

    this._styles = this._styles.sort((a, b) => a.range.start - b.range.start)
  }

  deleteTextStyleConcrete (range: Range, textStyle: TextStyle): void {
    let i: number = this._findStartIndexInStyles(range.start)

    if (i < 0) {
      return
    }

    for (i; i < this._styles.length; i++) {
      if (!this._styles[i].textStyle.deepCompare(textStyle)) {
        continue
      }

      if (this._styles[i].range.isInsideRange(range)) {
        this._styles.splice(i, 1)
      } else if (this._styles[i].range.isRangeInside(range)) {
        const leftPart: LineStyle = this._styles[i].copy()
        const rightPart: LineStyle = this._styles[i].copy()

        leftPart.range.end = range.start
        rightPart.range.start = range.end

        this._styles.splice(i, 1, leftPart, rightPart)
      } else if (this._styles[i].range.isStartInRange(range)) {
        this._styles[i].range.start = range.end
      } else if (this._styles[i].range.isEndInRange(range)) {
        this._styles[i].range.end = range.start
      } else {
        return
      }
    }

    this._styles = this._styles.sort((a, b) => a.range.start - b.range.start)
  }
}
