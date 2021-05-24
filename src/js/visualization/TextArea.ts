import { ITextCursorPositionSubscriber } from '../common/ITextCursorPositionSubscriber'
import { ITextRepresentationSubscriber } from '../common/ITextRepresentationSubscriber'
import { TextRepresentationAction } from '../core/TextRepresentation/TextRepresentationAction'
import { TextRepresentationChange } from '../core/TextRepresentation/TextRepresentationChange'
import { TextAreaTextSelectionPool } from './TextAreaTextSelectionPool'
import { TextAreaTextCursor } from './TextAreaTextCursor'
import { TextAreaTextLinePool } from './TextAreaTextLinePool'
import { MeasureHtmlTool } from './MeasureHtmlTool'
import { IRange } from '../common/IRange'
import { NodeRepresentation } from '../core/TextRepresentation/Nodes/NodeRepresentation'
import { NodeType } from '../core/TextRepresentation/Nodes/NodeType'
import { ITextCursorSelectionsSubscriber } from '../common/ITextCursorSelectionsSubscriber'

class TextArea implements ITextRepresentationSubscriber, ITextCursorPositionSubscriber, ITextCursorSelectionsSubscriber {
  private readonly _context: HTMLElement
  private readonly _measureHtmlTool: MeasureHtmlTool
  private readonly _textCursor: TextAreaTextCursor
  private readonly _textSelectionPool: TextAreaTextSelectionPool
  private readonly _textLinePool: TextAreaTextLinePool

  constructor () {
    this._context = document.createElement('div')
    this._context.classList.add('text-area')
    this._measureHtmlTool = new MeasureHtmlTool(this._context)
    this._textCursor = new TextAreaTextCursor()
    this._textLinePool = new TextAreaTextLinePool()
    this._textSelectionPool = new TextAreaTextSelectionPool()
  }

  private _removeTextLine (linePosition: number): void {
    this._textLinePool.removeTextLine(linePosition)
  }

  private _addTextLine (linePosition: number, line: HTMLElement): void {
    this._context.insertBefore(line, this._textLinePool.getTextLineContext(linePosition + 1))
    this._textLinePool.addTextLine(linePosition, line)
  }

  private _changeTextLine (linePosition: number, line: HTMLElement): void {
    this._textLinePool.changeTextLine(linePosition, line)
  }

  private _createHtmlNode (nodeRepresentation: NodeRepresentation): HTMLElement {
    let node: HTMLElement

    switch (nodeRepresentation.getType()) {
      case NodeType.TEXT:
        node = document.createElement('span')
        node.append(nodeRepresentation.getText())
        return node
      case NodeType.TEXT_STYLE:
        node = document.createElement('span')
        node.classList.add(`${nodeRepresentation.getTextStyle()}`)
        node.append(nodeRepresentation.getText())
        return node
      case NodeType.CONTAINER_STYLE:
        node = document.createElement('span')
        node.classList.add(`${nodeRepresentation.getTextStyle()}`)
        for (const child of nodeRepresentation.getChildren()) {
          node.append(this._createHtmlNode(child))
        }
        return node
      case NodeType.CONTAINER_LINE:
        node = document.createElement('div')
        node.classList.add('text-line')
        for (const child of nodeRepresentation.getChildren()) {
          node.append(this._createHtmlNode(child))
        }
        return node
      default:
        throw new Error(`TextArea can't handle such NodeRepresentation type: ${nodeRepresentation.getType()}`)
    }
  }

  getContext (): HTMLElement {
    return this._context
  }

  updateTextCursorPosition (x: number, y: number): void {
    if (this._textCursor.getY() !== y) {
      this._textCursor.removeHtmlElement()
      this._textCursor.setY(y)
      // this._textLinePool.appendChildToLine(y, this._textCursor.getHtmlElement())
    }

    this._textLinePool.appendChildToLine(y, this._textCursor.getHtmlElement())

    this._textCursor.setX(this._measureHtmlTool.computePositionInTextLine(this._textLinePool.getTextLineChildren(y), x))
  }

  updateTextCursorSelections (selections: IRange[]): void {
    const sel = this._textSelectionPool.updateSelections(selections)

    for (let i = 0; i < sel.length; i++) {
      let part = sel[i][0]
      let x = this._measureHtmlTool.computePositionInTextLine(this._textLinePool.getTextLineChildren(part.y), part.x)
      this._textLinePool.appendChildToLine(part.y, part.htmlElement)
      part.htmlElement.style.left = `${x}px`
      part.htmlElement.style.right = '0px'

      for (let l = 1; l < sel[i].length - 1; l++) {
        part = sel[i][l]
        x = this._measureHtmlTool.computePositionInTextLine(this._textLinePool.getTextLineChildren(part.y), part.x)
        this._textLinePool.appendChildToLine(part.y, part.htmlElement)
        part.htmlElement.style.left = `${x}px`
        part.htmlElement.style.right = '0px'
      }

      part = sel[i][sel[i].length - 1]
      x = this._measureHtmlTool.computePositionInTextLine(this._textLinePool.getTextLineChildren(part.y), part.x)
      this._textLinePool.appendChildToLine(part.y, part.htmlElement)
      part.htmlElement.style.left = '0px'
      part.htmlElement.style.width = `${x}px`
    }
  }

  updateTextRepresentation (changes: TextRepresentationChange[]): void {
    for (const change of changes) {
      switch (change.getAction()) {
        case TextRepresentationAction.REMOVE:
          this._removeTextLine(change.getPosition())
          break
        case TextRepresentationAction.ADD:
          this._addTextLine(change.getPosition(), this._createHtmlNode(change.getNodeRepresentation()))
          break
        case TextRepresentationAction.CHANGE:
          this._changeTextLine(change.getPosition(), this._createHtmlNode(change.getNodeRepresentation()))
          break
        default:
          throw new Error(`TextArea can't handle "${change.getAction()}" TextRepresentation action`)
      }
    }
  }
}

export { TextArea }
