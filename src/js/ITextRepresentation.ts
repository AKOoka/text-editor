import { ITextLine } from './ITextLine'

export interface ITextRepresentation {
  getLine: (linePosition: number) => ITextLine
  setLine: (linePosition: number, line: ITextLine) => void
}
