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

  addTextStyle (): void {
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

      const textStyle = new TextStyle('bold')

      this._textAreaWrapper.textContent.replace(specialChar, (_, offset) => {
        textStyle.startOffset = offset
        return ''
      })
      this._textAreaWrapper.textContent.replace(specialChar, (_, offset) => {
        textStyle.endOffset = offset as number + 1
        return ''
      })

      // sort by start before push ?
      // make a stack where there are just offset and type ?
      // make separate textStyles stack for line ?

      this._textStyles.push(textStyle)
    }
  }

  generateText (): string {
    const { textContent } = this._textAreaWrapper

    if (textContent === null) {
      throw new Error('there is no textContent in this._textAreaWrapper')
    }

    let output: string = ''
    output += textContent.slice(0, this._textStyles[0].startOffset)

    // for (const style of this._textStyles) {}

    return output
  }
}

export { TextArea }
