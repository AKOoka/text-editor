import { TextStyle } from '../common/TextStyle'
import { ILineWithStylesContent } from '../core/TextRepresentation/LineWithStyles/LineWithStylesContent'
import {
  InstructionProps,
  NodeRepresentation,
  NodeRepresentationInstructionId,
  NodeRepresentationType
} from '../core/TextRepresentation/Nodes/NodeRepresentation'
import { HtmlElementPool } from './HtmlElementPool'

type baseCreationFunction = () => HTMLElement
type InstructionFunction = (base: HTMLElement, props: InstructionProps) => void

class HtmlCreator {
  private readonly _htmlElementPool: HtmlElementPool
  private readonly _htmlCreationFunctions: Record<NodeRepresentationType, baseCreationFunction>
  private readonly _instructionFunctions: Record<NodeRepresentationInstructionId, InstructionFunction>

  constructor () {
    this._htmlElementPool = new HtmlElementPool()
    this._htmlCreationFunctions = {
      [NodeRepresentationType.LINE]: this._createHtmlLine.bind(this),
      [NodeRepresentationType.TEXT]: this._createHtmlTextNode.bind(this)
    }
    this._instructionFunctions = {
      [NodeRepresentationInstructionId.TEXT]: this._readTextInstruction.bind(this),
      [NodeRepresentationInstructionId.CONTAINER]: this._readContainerInstruction.bind(this),
      [NodeRepresentationInstructionId.STYLE]: this._readStyleInstruction.bind(this)
    }
  }

  private _createHtmlLine (): HTMLElement {
    const line: HTMLElement = this._htmlElementPool.getTextLine()
    line.classList.add('text-line')
    return line
  }

  private _createHtmlTextNode (): HTMLElement {
    return this._htmlElementPool.getNode()
  }

  private _readTextInstruction (base: HTMLElement, props: string): void {
    base.append(props)
  }

  private _readContainerInstruction (base: HTMLElement, props: NodeRepresentation[]): void {
    for (const nodeRepresentation of props) {
      base.append(this.createHtmlFromNodeRepresentation(nodeRepresentation))
    }
  }

  private _readStyleInstruction (base: HTMLElement, props: TextStyle): void {
    base.style.setProperty(props.property, props.value)
  }

  createHtmlFromNodeRepresentation (nodeRepresentation: NodeRepresentation): HTMLElement {
    const element: HTMLElement = this._htmlCreationFunctions[nodeRepresentation.representationType]()

    for (const instruction of nodeRepresentation.getInstructions()) {
      this._instructionFunctions[instruction.instructionType](element, instruction.instructionProp)
    }

    return element
  }

  createHtmlElementFromNodeRepresentationType (type: NodeRepresentationType): HTMLElement {
    return this._htmlCreationFunctions[type]()
  }

  createHtmlElement (elementName: keyof HTMLElementTagNameMap): HTMLElement {
    return document.createElement(elementName)
  }

  createHtmlLineFromContentLineWithStyles (content: ILineWithStylesContent): HTMLElement {
    const htmlLine: HTMLElement = this._createHtmlLine()

    if (content.styles.length === 0) {
      htmlLine.innerText = content.text
      return htmlLine
    }

    const styles = []

    for (const s of content.styles) {
      styles.push(
        { position: s.range.start, textStyle: s.textStyle },
        { position: s.range.end, textStyle: s.textStyle }
      )
    }

    let lineInnerHtml: string = ''
    const styleStack: typeof styles = []

    lineInnerHtml = content.text.slice(0, styles[0].position)

    for (let i = 1; i < styles.length - 1; i++) {
      const style = styles[i]

      lineInnerHtml += content.text.slice(styleStack[styleStack.length - 1].position, style.position)

      if (styleStack.length === 0) {
        lineInnerHtml += `<span style='${style.textStyle.property}: ${style.textStyle.value}'>`
        styleStack.push(style)

        continue
      }

      if (styleStack[styleStack.length - 1].textStyle.deepCompare(style.textStyle)) {
        lineInnerHtml += '</span>'
        styleStack.pop()
      } else {
        const startIndex = styleStack.findIndex(v => v.textStyle.deepCompare(style.textStyle))
        lineInnerHtml += '</span>'

        if (startIndex < 0) {
          lineInnerHtml += `<span style="${style.textStyle.property}: ${style.textStyle.value}">`
          styleStack.push(style)
          continue
        }

        styleStack.splice(startIndex, 1)
        const reopenStyles = styleStack.slice(startIndex)

        lineInnerHtml += '</span>'.repeat(reopenStyles.length)

        for (const style of reopenStyles) {
          lineInnerHtml += `<span style="${style.textStyle.property}: ${style.textStyle.value}">`
        }
      }
    }

    lineInnerHtml = content.text.slice(styles[styles.length - 1].position)

    htmlLine.innerHTML = lineInnerHtml

    return htmlLine
  }
}

export { HtmlCreator }
