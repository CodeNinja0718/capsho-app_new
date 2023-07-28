export interface RefreshInterface {
  value: string
  readonly prevValues: string[]
  updateValue(value: string): void
  getPrevValue(): void
  readonly isRefreshAllowed: boolean
}

export class RefreshModel implements RefreshInterface {
  value: string
  readonly prevValues: string[]
  private refreshCountLimit: number
  private _isRefreshAllowed: boolean
  private _lastIndex: number
  constructor (value: string, refreshMaxLimit = 3) {
    this.value = value
    this.prevValues = [value]
    this.refreshCountLimit = refreshMaxLimit
    this._isRefreshAllowed = !(this.refreshCountLimit < 1)
    this._lastIndex = 0
  }

  get isRefreshAllowed () {
    return this._isRefreshAllowed
  }

  updateValue (value: string): void {
    this.value = value
    this.prevValues.push(value)
    this.refreshCountLimit -= 1
    this._isRefreshAllowed = !(this.refreshCountLimit < 1)
    this.decreaseIndex()
  }

  getPrevValue (): void {
    this.value = this.returnLast()
  }

  private returnLast (): string {
    const value = this.prevValues[this._lastIndex]
    this.decreaseIndex()
    return value
  }

  private decreaseIndex (): void {
    this._lastIndex -= 1
    if (this._lastIndex < 0) {
      this._lastIndex = this.prevValues.length - 1
    }
  }
}
