import { TextStyle } from '../common/TextStyle'
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
}

export { HtmlCreator }
