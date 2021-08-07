import { TextStyle } from '../../../../common/TextStyle'
import { NodeLayer } from '../NodeLayer'
import { Node, INodeContainer, INodeText, INodeTextStyle } from '../nodes/INode'
import { NodeContainer } from '../nodes/NodeContainer'
import { NodeText } from '../nodes/NodeText'
import { NodeTextStyle } from '../nodes/NodeTextStyle'

export class NodeCreator {
  // private _nodePool: Node[]

  createNodeText (text: string): INodeText {
    return new NodeText(text)
  }

  createNodeTextStyle (text: string, textStyle: TextStyle): INodeTextStyle {
    return new NodeTextStyle(text, textStyle)
  }

  createNodeContainer (textStyle: TextStyle, childNodes: NodeLayer): INodeContainer {
    return new NodeContainer(textStyle, childNodes)
  }

  createNodeLayer (node: Node): NodeLayer {
    return new NodeLayer(node)
  }

  // releaseNode (): void {
  //   this._nodePool[node].isActive = false
  // }
}
