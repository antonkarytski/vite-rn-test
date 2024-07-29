type CombineUnit = Logger | ((state?: boolean) => void)

export class Logger {
  public static combine<R>(
    enablers: CombineUnit[] | CombineUnit,
    returnValue?: R
  ): (state?: boolean) => R
  public static combine(
    enablers: CombineUnit[] | CombineUnit
  ): (state?: boolean) => void
  public static combine<R>(
    enablers: CombineUnit[] | CombineUnit,
    returnValue?: R
  ) {
    const list = Array.isArray(enablers) ? enablers : [enablers]

    return (state = true) => {
      list.forEach((enabler) => {
        if (enabler instanceof Logger) {
          enabler.setEnabled(state)
        } else {
          enabler(state)
        }
      })
      return returnValue
    }
  }

  private title: string
  private isEnabled = false

  public constructor(title: string) {
    this.title = title
  }

  public enable() {
    this.isEnabled = true
  }

  public disable() {
    this.isEnabled = false
  }

  public readonly setEnabled = (value = true) => {
    this.isEnabled = value
  }

  public setTitle(title: string) {
    this.title = title
  }

  public log(...args: any[]) {
    if (this.isEnabled) console.log(this.title, ...args)
  }

  public warn(...args: any[]) {
    if (this.isEnabled) console.warn(this.title, ...args)
  }
}
