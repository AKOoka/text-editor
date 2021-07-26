export class InputModifiers {
  private _selectingMode: boolean
  private _selectingModeMouse: boolean
  private _selectingModeKeyboard: boolean

  constructor () {
    this._selectingMode = false
    this._selectingModeMouse = false
    this._selectingModeKeyboard = false
  }

  public get selectingMode (): boolean {
    return this._selectingMode
  }

  public set selectingMode (value: boolean) {
    this._selectingMode = value
  }

  public get selectingModeMouse (): boolean {
    return this._selectingModeMouse
  }

  public set selectingModeMouse (value: boolean) {
    this._selectingModeMouse = value
  }

  public get selectingModeKeyboard (): boolean {
    return this._selectingModeKeyboard
  }

  public set selectingModeKeyboard (value: boolean) {
    this._selectingModeKeyboard = value
  }

  reset (): void {
    this._selectingMode = false
    this._selectingModeMouse = false
    this._selectingModeKeyboard = false
  }
}
