import { Event } from 'effector'

type WSPromiseProps = {
  timeout?: number
  autoQueue?: boolean
}

type PromiseQueueItem<P> = {
  resolve: (payload: P) => void
  reject: () => void
  onStart?: () => void
}

type BindWithProps<P, AP extends unknown[]> = {
  action: (...params: AP) => void
  message?: Event<P>
}
export class WSPromise<P> {
  private isAutoQueue
  private readonly timeout: number | null = null

  private currentItem: PromiseQueueItem<P> | null = null
  private readonly queue: PromiseQueueItem<P>[] = []
  private pendingTimeout: ReturnType<typeof setTimeout> | null = null

  private clear = () => {
    this.currentItem = null
    if (this.pendingTimeout) clearTimeout(this.pendingTimeout)
    this.pendingTimeout = null
  }
  public get pending() {
    return !!this.currentItem
  }

  public constructor({ timeout, autoQueue }: WSPromiseProps = {}) {
    if (timeout) this.timeout = timeout
    this.isAutoQueue = !!autoQueue
  }
  public readonly resolve = (payload: P) => {
    this.currentItem?.resolve(payload)
    this.clear()
    const next = this.queue.shift()
    if (next) this.startExistingItem(next)
  }

  public readonly reject = () => {
    this.currentItem?.reject()
    this.clear()
    const next = this.queue.shift()
    if (next) this.startExistingItem(next)
  }

  private startExistingItem(item: PromiseQueueItem<P>) {
    if (this.pending) throw new Error('Promise is already pending')
    this.currentItem = item
    item.onStart?.()
    if (this.timeout) {
      this.pendingTimeout = setTimeout(() => {
        this.reject()
      }, this.timeout)
    }
  }

  public start(fn?: () => void) {
    if (this.pending) {
      if (this.isAutoQueue && fn) return this.startInQueue(fn)
      throw new Error('Promise is already pending')
    }
    fn?.()
    if (this.timeout) {
      this.pendingTimeout = setTimeout(() => {
        this.reject()
      }, this.timeout)
    }
    return new Promise<P>((resolve, reject) => {
      this.currentItem = { resolve, reject }
    })
  }

  public startInQueue(fn: () => void) {
    return new Promise<P>((resolve, reject) => {
      const item = { resolve, reject, onStart: fn }
      this.queue.push(item)
    })
  }

  public bindWith<AP extends unknown[]>({
    message,
    action,
  }: BindWithProps<P, AP>) {
    if (message) {
      message.watch((props) => this.resolve(props))
    }
    return Object.assign((...params: AP) => {
      return this.start(() => {
        action(...params)
      })
    }, this)
  }

  public autoQueue(state = true) {
    this.isAutoQueue = state
    return this
  }
}
