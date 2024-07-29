import { Logger } from '../logger/Logger'
import { Typer } from './Typer'
import { StructureCreator } from './types'

type SenderReceiverPairSettings = {
  typeParamName?: string
}

type SingleSenderProps = {
  channel: (value: string) => void | boolean
  multiChannel?: never
}

type MultiSenderProps = {
  channel?: never
  multiChannel: (id: string, value: string) => void | boolean
}

type SenderProps = SingleSenderProps | MultiSenderProps

type CreateMessageHandlerReturn<A> = never | void extends A
  ? (data: string, props?: A) => void
  : (data: string, props: A) => void

const DEFAULT_TYPE_PARAM_NAME = 'type'
export class SenderReceiverPair<S extends Record<string, any>> {
  private logger = new Logger('Sender Receiver Router:')
  public readonly debug = (state = true) => {
    this.logger.setEnabled(state)
    return this
  }

  private readonly typeParamName
  private readonly structure
  constructor(
    structure: StructureCreator<S>,
    { typeParamName = DEFAULT_TYPE_PARAM_NAME }: SenderReceiverPairSettings = {}
  ) {
    this.structure = structure({ message: Typer.create })
    if ('message' in this.structure) {
      throw new Error(
        'Key `message` is reserved in SenderReceiverPair, please chose another one for structure'
      )
    }
    this.typeParamName = typeParamName
  }

  public sender(props: SingleSenderProps): {
    [K in keyof S]: (props: S[K]) => void | boolean
  }
  public sender(props: MultiSenderProps): {
    [K in keyof S]: (id: string, props: S[K]) => void | boolean
  }
  public sender({ channel, multiChannel }: SenderProps) {
    this.logger.setTitle('Sender router:')
    if (channel) {
      const senderStructure = {} as {
        [K in keyof S]: (props: S[K]) => void | boolean
      }
      for (let key in this.structure) {
        senderStructure[key as keyof S] = (props: any) => {
          return channel(
            JSON.stringify({ ...props, [this.typeParamName]: key })
          )
        }
      }
      return senderStructure
    }
    const senderStructure = {} as {
      [K in keyof S]: (id: string, props: S[K]) => void | boolean
    }
    for (let key in this.structure) {
      senderStructure[key as keyof S] = (id: string, props: any) => {
        return multiChannel(
          id,
          JSON.stringify({ ...props, [this.typeParamName]: key })
        )
      }
    }
    return senderStructure
  }

  private createMessageHandler<A>(
    router: Partial<Record<string, (props: any) => void>>
  ): CreateMessageHandlerReturn<A> {
    return ((data: string, additional?: A) => {
      try {
        const message = JSON.parse(data)
        if (typeof message !== 'object') return
        this.logger.log('Message', message)
        const type = message[this.typeParamName]
        type &&
          router[type]?.(additional ? { ...message, ...additional } : message)
      } catch {}
    }) as CreateMessageHandlerReturn<A>
  }

  public receiver<
    A,
    L extends Partial<{ [K in keyof S]: (props: S[K] & A) => void }>,
  >(handlers: L, _?: () => A) {
    this.logger.setTitle('Receiver:')
    return {
      ...handlers,
      message: this.createMessageHandler<A>(handlers),
    }
  }
  public singleEventReceiver<A>(_?: A) {
    let router: null | CreateMessageHandlerReturn<A> = null
    return {
      setUp: <L extends Partial<{ [K in keyof S]: (props: S[K] & A) => void }>>(
        handlers: L
      ) => {
        router = this.createMessageHandler<A>(handlers)
      },
      message: (data: string, add: A) => {
        router?.(data, add)
      },
      clean: () => {
        router = null
      },
    }
  }
}
