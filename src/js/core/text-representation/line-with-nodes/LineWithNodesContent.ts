import { Range } from '../../../common/Range'
import { TextStyle } from '../../../common/TextStyle'
import { ILineContent, StyleWithRange } from '../ILineContent'
import { Node, NodeType } from './nodes/Node'

export class LineWithNodesContent implements ILineContent {
  private readonly _content: Node[]
  private readonly _size: number

  constructor (content: Node[], size?: number) {
    this._content = content

    if (size === undefined) {
      this._size = this._content.reduce((p, c) => p + c.size, 0)
    } else {
      this._size = size
    }
  }

  getContent (): Node[] {
    return this._content
  }

  getStyles (nodes: Node[] = this._content): StyleWithRange[] {
    const stylesWithRange: StyleWithRange[] = []

    let offset: number = 0

    for (const n of nodes) {
      if (n.type === NodeType.TEXT_STYLE) {
        stylesWithRange.push({
          textStyle: n.style,
          range: new Range(offset, offset + n.size)
        })
      } else if (n.type === NodeType.CONTAINER) {
        stylesWithRange.push(...this.getStyles(n.childNodes))
      }

      offset += n.size
    }

    return stylesWithRange
  }

  getStylesConcrete (textStyles: TextStyle[], nodes: Node[] = this._content): StyleWithRange[] {
    const stylesWithRange: StyleWithRange[] = []

    let offset: number = 0

    for (const n of nodes) {
      if (
        n.type === NodeType.TEXT_STYLE &&
        textStyles.some(v => v.deepCompare(n.style))
      ) {
        stylesWithRange.push({
          textStyle: n.style,
          range: new Range(offset, offset + n.size)
        })
      } else if (n.type === NodeType.CONTAINER) {
        stylesWithRange.push(...this.getStylesConcrete(textStyles, n.childNodes))
      }

      offset += n.size
    }

    return stylesWithRange
  }

  getText (nodes: Node[] = this._content): string {
    let text: string = ''

    for (const n of nodes) {
      if (n.type === NodeType.CONTAINER) {
        text += this.getText(n.childNodes)
      } else {
        text += n.text
      }
    }

    return text
  }

  getSize (): number {
    return this._size
  }
}
