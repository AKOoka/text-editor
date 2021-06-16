import { TextStyle } from '../../../common/TextStyle'

export enum NodeRepresentationType {
  LINE,
  TEXT,
}

export enum NodeRepresentationInstructionId {
  TEXT,
  CONTAINER,
  STYLE
}

export interface InstructionProps {
  value: string | NodeRepresentation[] | TextStyle
}

export interface INodeRepresentationInstruction {
  instructionType: NodeRepresentationInstructionId
  instructionProps: InstructionProps
}

class NodeRepresentation {
  private _instructions: INodeRepresentationInstruction[]
  private _representationType: NodeRepresentationType
  private _size: number

  constructor () {
    this._instructions = []
  }

  get representationType (): NodeRepresentationType {
    return this._representationType
  }

  set representationType (baseType: NodeRepresentationType) {
    this._representationType = baseType
  }

  get size (): number {
    return this._size
  }

  set size (size: number) {
    this._size = size
  }

  addTextInstruction (text: string): NodeRepresentation {
    this._instructions.push({ instructionType: NodeRepresentationInstructionId.TEXT, instructionProps: { value: text } })
    return this
  }

  addStyleInstruction (style: TextStyle): NodeRepresentation {
    this._instructions.push({ instructionType: NodeRepresentationInstructionId.STYLE, instructionProps: { value: style } })
    return this
  }

  addContainerInstruction (containerChildren: NodeRepresentation[]): NodeRepresentation {
    this._instructions.push({ instructionType: NodeRepresentationInstructionId.CONTAINER, instructionProps: { value: containerChildren } })
    return this
  }

  clearInstructions (): void {
    this._instructions = []
  }

  getInstructions (): INodeRepresentationInstruction[] {
    return this._instructions
  }
}

export { NodeRepresentation }
