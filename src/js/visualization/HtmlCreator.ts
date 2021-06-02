import {
  InstructionProps,
  NodeRepresentation, NodeRepresentationInstructionId,
  NodeRepresentationType
} from '../core/TextRepresentation/NodeRepresentation'

type baseCreationFunction = () => HTMLElement
type InstructionFunction = (base: HTMLElement, props: InstructionProps) => void

class HtmlCreator {
  private readonly _htmlCreationFunctions: Record<NodeRepresentationType, baseCreationFunction>
  private readonly _instructionFunctions: Record<NodeRepresentationInstructionId, InstructionFunction>

  constructor () {
    this._htmlCreationFunctions = this._createHtmlCreationFunctions()
    this._instructionFunctions = this._createInstructionFunctions()
  }

  private _createHtmlCreationFunctions (): Record<NodeRepresentationType, baseCreationFunction> {
    return {
      [NodeRepresentationType.LINE] (): HTMLElement {
        const line: HTMLElement = document.createElement('div')
        line.classList.add('text-line')
        return line
      },
      [NodeRepresentationType.TEXT] (): HTMLElement {
        return document.createElement('span')
      }
    }
  }

  private _createInstructionFunctions (): Record<NodeRepresentationInstructionId, InstructionFunction> {
    return {
      [NodeRepresentationInstructionId.TEXT]: this._readTextInstruction,
      [NodeRepresentationInstructionId.CONTAINER]: this._readContainerInstruction,
      [NodeRepresentationInstructionId.STYLE]: this._readStyleInstruction,
      [NodeRepresentationInstructionId.STYLE_WITH_VALUE]: this._readStyleWithValueInstruction
    }
  }

  private _readTextInstruction (base: HTMLElement, props: { value: string }): void {
    base.append(props.value)
  }

  private _readContainerInstruction (base: HTMLElement, props: { value: NodeRepresentation[] }): void {
    for (const nodeRepresentation of props.value) {
      base.append(this.createHtmlFromNodeRepresentation(nodeRepresentation))
    }
  }

  private _readStyleInstruction (base: HTMLElement, props: { value: string }): void {
    base.classList.add(props.value)
  }

  private _readStyleWithValueInstruction (base: HTMLElement, props: { value: string, style: string }): void {
    base.style.setProperty(props.style, props.value)
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
