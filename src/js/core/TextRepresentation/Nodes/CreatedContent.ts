import { TextStyleType } from '../../../common/TextStyleType'
import { INode } from './INode'

export interface CreatedContent {
  nodes: INode[]
  nodeStyles: TextStyleType[]
}
