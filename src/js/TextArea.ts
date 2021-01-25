import { TextStyle } from './TextStyle'

class TextArea {
  private readonly _textAreaWrapper: HTMLDivElement
  // private readonly _text: string
  private readonly _textStyles: TextStyle[]

  get textAreaWrapper (): HTMLDivElement {
    return this._textAreaWrapper
  }

  constructor () {
    // this._text = ''
    this._textStyles = []
    this._textAreaWrapper = document.createElement('div')

    this._textAreaWrapper.contentEditable = 'true'
    this._textAreaWrapper.classList.add('text-area')
  }

  addTextStyle (styleType: string): void {
    const selection: Selection | null = document.getSelection()
    const specialChar: string = '#'

    if (selection === null) {
      throw new Error('there is no selection')
    }

    for (let i = 0; i <= selection.rangeCount; i++) {
      const {
        startContainer,
        startOffset,
        endContainer,
        endOffset
      } = selection.getRangeAt(i)

      if (
        startContainer.textContent === null ||
        endContainer.textContent === null ||
        this._textAreaWrapper.textContent === null
      ) {
        throw new Error('no text content in text area || start/end container')
      }

      startContainer.textContent = startContainer.textContent.slice(0, startOffset) +
                                   specialChar +
                                   startContainer.textContent.slice(startOffset)
      endContainer.textContent = endContainer.textContent.slice(0, endOffset) +
                                 specialChar +
                                 endContainer.textContent.slice(endOffset)

      // const textStyle = new TextStyle('bold')

      // this._textAreaWrapper.textContent.replace(specialChar, (_, offset) => {
      //   textStyle.offset = offset
      //   return ''
      // })
      // this._textAreaWrapper.textContent.replace(specialChar, (_, offset) => {
      //   textStyle.offset = offset as number + 1
      //   return ''
      // })

      this._textAreaWrapper.textContent = this._textAreaWrapper.textContent.replace(specialChar, (_, offset: number): string => {
        this._textStyles.push(new TextStyle(styleType, offset))
        return ''
      })
      this._textAreaWrapper.textContent = this._textAreaWrapper.textContent.replace(specialChar, (_, offset: number): string => {
        this._textStyles.push(new TextStyle(styleType, offset + 1))
        return ''
      })
      // this._textStyles.push(textStyle)

      // sort by start before push ?
      // can also add if TextStyle is opening or closing tag
      // make a stack where there are just offset and type ?
      // make separate textStyles stack for line ?

      this._generateText()
    }
  }

  private _generateText (): void {
    const { textContent } = this._textAreaWrapper

    if (textContent === null) {
      throw new Error('there is no textContent in this._textAreaWrapper')
    }

    this._textStyles.sort((a: TextStyle, b: TextStyle): number => {
      return a.offset - b.offset
    })

    const stack: TextStyle[] = []
    let output: string = ''

    output += textContent.slice(0, this._textStyles[0].offset) + `<span class="${this._textStyles[0].type}">`
    stack.push(this._textStyles[0])

    for (let i = 1; i < this._textStyles.length; i++) {
      const style = this._textStyles[i]
      const s: TextStyle = stack[stack.length - 1]

      output += textContent.slice(s.offset, style.offset)

      if (s.type === style.type) {
        stack.pop()
        output += `</span class="${style.type}">`
      } else if (stack.some((el: TextStyle): boolean => el.type === style.type)) {
        let l = stack.length - 1

        for (l; l >= 0; l--) {
          const ts: TextStyle = stack[l]
          output += `</span class="${ts.type}">`
          if (ts.type === style.type) {
            stack.splice(l, 1)
            break
          }
        }

        for (l; l < stack.length; l++) {
          const ts: TextStyle = stack[l]
          output += `<span class="${ts.type}">`
        }
      } else {
        stack.push(style)
        output += `<span class="${style.type}">`
      }
    }

    output += textContent.slice(this._textStyles[this._textStyles.length - 1].offset)
    this._textAreaWrapper.innerHTML = output
  }
}

export { TextArea }
