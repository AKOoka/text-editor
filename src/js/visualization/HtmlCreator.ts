import { TextStyle } from '../common/TextStyle'
import {
  InstructionProps,
  NodeRepresentation, NodeRepresentationInstructionId,
  NodeRepresentationType
} from '../core/TextRepresentation/Nodes/NodeRepresentation'

type baseCreationFunction = () => HTMLElement
type InstructionFunction = (base: HTMLElement, props: InstructionProps) => void

class HtmlCreator {
  private readonly _htmlCreationFunctions: Record<NodeRepresentationType, baseCreationFunction>
  private readonly _instructionFunctions: Record<NodeRepresentationInstructionId, InstructionFunction>

  constructor () {
    this._htmlCreationFunctions = {
      [NodeRepresentationType.LINE]: this._createHtmlLine,
      [NodeRepresentationType.TEXT]: this._createHtmlTextNode
    }
    this._instructionFunctions = {
      [NodeRepresentationInstructionId.TEXT]: this._readTextInstruction.bind(this),
      [NodeRepresentationInstructionId.CONTAINER]: this._readContainerInstruction.bind(this),
      [NodeRepresentationInstructionId.STYLE]: this._readStyleInstruction.bind(this)
    }
  }

  private _createHtmlLine (): HTMLElement {
    const line: HTMLElement = document.createElement('div')
    line.classList.add('text-line')
    return line
  }

  private _createHtmlTextNode (): HTMLElement {
    return document.createElement('span')
  }

  private _readTextInstruction (base: HTMLElement, props: { value: string }): void {
    base.append(props.value)
  }

  private _readContainerInstruction (base: HTMLElement, props: { value: NodeRepresentation[] }): void {
    for (const nodeRepresentation of props.value) {
      base.append(this.createHtmlFromNodeRepresentation(nodeRepresentation))
    }
  }

  private _readStyleInstruction (base: HTMLElement, props: { value: TextStyle }): void {
    base.style.setProperty(props.value.property, props.value.value)
  }

  createHtmlFromNodeRepresentation (nodeRepresentation: NodeRepresentation): HTMLElement {
    const element: HTMLElement = this._htmlCreationFunctions[nodeRepresentation.representationType]()

    for (const instruction of nodeRepresentation.getInstructions()) {
      this._instructionFunctions[instruction.instructionType](element, instruction.instructionProps)
    }

    return element
  }

  createHtmlElement (type: NodeRepresentationType): HTMLElement {
    return this._htmlCreationFunctions[type]()
  }
}

export { HtmlCreator }
