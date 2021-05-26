import { NodeType } from './NodeType'
import { TextStyleType } from '../../../common/TextStyleType'

class NodeRepresentation {
  type: NodeType
  text: string
  textStyle: TextStyleType
  children: NodeRepresentation[]
  size: number
}

export { NodeRepresentation }
