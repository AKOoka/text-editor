import { TextRepresentationAction } from './TextRepresentationAction'
import { NodeRepresentation } from './NodeRepresentation'

class TextRepresentationChange {
  action: TextRepresentationAction
  position: number
  nodeRepresentation: NodeRepresentation
}

export { TextRepresentationChange }
