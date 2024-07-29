import {
  createEvent,
  createStore,
  Event as EffectorEvent,
  sample,
} from 'effector'
import { JoinActionsList, SocketAction } from './types'
import { Logger } from '../logger/Logger'
import { Typer } from '../connection/Typer'
import {
  ActionPair,
  StructureCreator,
  TypeStructure,
} from '../connection/types'
import {
  createMessageList,
  defaultActionCreator,
  straightDataRetriever,
  typeKeyRetriever,
} from './helpers'
import { createRoutedEvent } from '../models/effector/routedEvent'

type SocketManagerProps<A extends object, M extends object> = {
  host?: string
  actionCreator?: (action: string | number | symbol, payload: any) => any
  keyRetriever?: (data: any) => string
  dataRetriever?: (data: any) => M[keyof M]
  actions: StructureCreator<A>
  messages?: StructureCreator<M>
}

const EMPTY = {}

export class SocketManager<
  Messages extends object = any,
  Actions extends object = any
> {
  private ws: WebSocket | null = null
  private host = ''
  private readonly actionCreator
  private readonly keyRetriever
  private readonly dataRetriever
  private readonly logger = new Logger('Socket')

  public get isOpened() {
    return this.ws && this.ws.readyState === this.ws.OPEN
  }

  public readonly opened = createEvent()
  public readonly messageReceived = createEvent<JoinActionsList<Messages>>()
  public readonly closed = createEvent<CloseEvent>()
  public readonly error = createEvent<Event>()
  public readonly $isOpened = createStore(false)
    .on(this.closed, () => false)
    .on(this.opened, () => true)

  private readonly structure
  public readonly send: { [K in keyof Actions]: (props: Actions[K]) => void }

  private readonly messagesMap: Record<string, keyof Messages> = EMPTY as any
  public readonly message: {
    [K in keyof Messages]: EffectorEvent<Messages[K]>
  } = EMPTY as any

  private actionsQueue: ActionPair<Actions>[] = []
  private readonly sendMessage = createRoutedEvent<Actions>()

  private getActionKey(key: keyof Actions) {
    return this.structure[key].key || key
  }

  public constructor({
    host = '',
    actionCreator = defaultActionCreator,
    keyRetriever = typeKeyRetriever,
    dataRetriever = straightDataRetriever,
    messages,
    actions,
  }: SocketManagerProps<Actions, Messages>) {
    this.structure = actions({ message: Typer.item })
    this.send = this.createActionsList(this.structure)
    if (messages) {
      const { list, map } = createMessageList(messages({ message: Typer.item }))
      this.messagesMap = map
      this.message = list
    }

    this.actionCreator = actionCreator
    this.keyRetriever = keyRetriever
    this.dataRetriever = dataRetriever

    this.setHost(host)

    this.$isOpened.updates.watch((isOpened) => {
      if (!isOpened) return
      const queue = this.actionsQueue
      this.actionsQueue = []
      queue.forEach((actionData) => {
        this.sendMessage.event(actionData)
      })
    })

    sample({
      source: this.$isOpened,
      clock: this.sendMessage.event,
      fn: (isOpened, data) => ({ isOpened, data }),
    }).watch(({ isOpened, data }) => {
      if (!isOpened || !this.ws || this.ws.readyState !== this.ws.OPEN) {
        this.actionsQueue.push(data)
        return
      }
      const message = this.actionCreator(
        this.getActionKey(data.key),
        data.payload
      )
      this.logger.log('send', message)
      const request = JSON.stringify(message)
      this.ws.send(request)
    })
  }
  private createActionsList(actions: TypeStructure<Actions>) {
    const list = {} as { [K in keyof Actions]: (props: Actions[K]) => void }
    for (let key in actions) {
      list[key] = (props: any) => this.sendMessage(key, props)
    }
    return list
  }

  private readonly onOpen = () => {
    this.opened()
  }

  private readonly onMessage = (event: MessageEvent<any>) => {
    try {
      const message = JSON.parse(event.data) as JoinActionsList<Messages>
      this.logger.log('message', message)
      if (this.message !== EMPTY) {
        const key = this.messagesMap[this.keyRetriever(message)]
        if (key) this.message[key]?.(this.dataRetriever(message))
      }
      this.messageReceived(message)
    } catch {}
  }

  private readonly onClose = (e: CloseEvent) => {
    this.closed(e)
    this.logger.log('closed', e)
  }

  private readonly onError = (e: Event) => {
    this.logger.warn('error', e)
    this.error(e)
  }

  public readonly start = () => {
    if (!this.host) throw new Error('Host is not defined')
    this.ws = new WebSocket(this.host)
    this.ws.addEventListener(SocketAction.OPEN, this.onOpen)
    this.ws.addEventListener(SocketAction.MESSAGE, this.onMessage)
    this.ws.addEventListener(SocketAction.CLOSE, this.onClose)
    this.ws.addEventListener(SocketAction.ERROR, this.onError)
  }

  public readonly stop = () => {
    if (!this.ws) return
    this.ws.close()
    this.ws.removeEventListener(SocketAction.OPEN, this.onOpen)
    this.ws.removeEventListener(SocketAction.MESSAGE, this.onMessage)
    this.ws.removeEventListener(SocketAction.ERROR, this.onError)
    this.ws.removeEventListener(SocketAction.CLOSE, this.onClose)
  }

  public reInit() {
    this.stop()
    this.start()
  }

  public readonly debug = (state = true) => {
    this.logger.setEnabled(state)
    return this
  }

  public setHost(host: string) {
    this.host = host
    this.logger.setTitle(`Socket: ${host}`)
  }
}
