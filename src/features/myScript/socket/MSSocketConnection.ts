import { NewContentPartPayload } from './types/clientActions'
import {
  ContentPackageDescriptionPayload,
  NewPartPayload,
  PartChangedPayload,
} from './types/serverActions'
import { MSConfiguration } from './types/config'
import { ISize } from '../../../lib/units/types'
import { WSPromise } from '../../../lib/sockets/WSPromise'
import { CONTENT_PART_CONFIG } from './config'
import { INITIAL_CONTENT_SIZE, initialPackagePayload } from './helpers.socket'
import { createMSSocketManager } from './MSSocketManager'

export type MyScriptSocketConnectionProps = {
  appKey: string
  host: string
}

export type MyScriptSocketConnectionSettings = {
  autoQueue?: boolean
}

export type DrawAreaConfig = {
  size: ISize
}

export class MSSocketConnection {
  public readonly ws = createMSSocketManager()
  public readonly message = this.ws.message
  public readonly start = this.ws.start.bind(this.ws)
  public readonly stop = this.ws.stop.bind(this.ws)
  public readonly setHost = this.ws.setHost.bind(this.ws)

  public get isOpened() {
    return this.ws.isOpened
  }

  protected readonly appKey: string
  protected config: MSConfiguration | null = null
  protected drawAreaConfig: DrawAreaConfig = {
    size: INITIAL_CONTENT_SIZE,
  }

  protected currentContentPart = ''
  protected sessionId: string | null = null
  protected isOnReInit = false

  public readonly createContentPart = new WSPromise<NewPartPayload>({
    timeout: 3000,
  }).bindWith({
    message: this.ws.message.newPart,
    action: (payload: NewContentPartPayload = CONTENT_PART_CONFIG) =>
      this.ws.send.newContentPart(payload),
  })

  public readonly openContentPart = new WSPromise<PartChangedPayload>({
    timeout: 3000,
  }).bindWith({
    action: (id: string) => {
      if (!this.ws.isOpened) throw new Error('Socket is closed')
      this.ws.send.openContentPart({
        id,
        mimeTypes: CONTENT_PART_CONFIG.mimeTypes,
      })
    },
  })

  public readonly initPromise = new WSPromise<ContentPackageDescriptionPayload>(
    {
      timeout: 5000,
    }
  )

  public constructor(
    { appKey, host }: MyScriptSocketConnectionProps,
    { autoQueue }: MyScriptSocketConnectionSettings = {}
  ) {
    this.appKey = appKey
    this.ws.setHost(host)
    if (autoQueue) {
      this.createContentPart.autoQueue()
    }

    this.ws.message.ack.watch((response) => {
      this.sessionId = response.iinkSessionId
    })

    this.ws.message.partChanged.watch((response) => {
      if (response.partId === this.currentContentPart) {
        this.openContentPart.resolve(response)
      }
    })

    this.ws.opened.watch(() => {
      if (this.isOnReInit && this.sessionId) {
        this.isOnReInit = false
        return this.reInitSession(this.sessionId)
      }
      this.createContentPackage()
    })

    this.ws.error.watch(() => {
      this.createContentPart.reject()
      this.initPromise.reject()
    })

    this.ws.closed.watch(() => {
      this.createContentPart.reject()
      this.initPromise.reject()
      this.openContentPart.reject()
    })

    this.ws.closed.watch(() => {
      this.createContentPart.reject()
      this.initPromise.reject()
      this.openContentPart.reject()
    })
  }

  public reInit(withContentPart?: string | null) {
    if (this.sessionId) this.isOnReInit = true
    this.currentContentPart = withContentPart || ''
    this.ws.reInit()
    return this.initPromise.start()
  }

  public setGrammarId(id: string) {
    this.config = {
      ...this.config,
      math: {
        ...this.config?.math,
        customGrammarId: id,
      },
    }
  }

  public setConfig(config: MSConfiguration) {
    this.config = config
    return this
  }

  public setDrawAreaConfig(config: Partial<DrawAreaConfig>) {
    this.drawAreaConfig = {
      ...this.drawAreaConfig,
      ...config,
    }
    return this
  }

  public reInitSession(sessionId: string) {
    this.ws.send.restoreSession({
      ...initialPackagePayload(this.drawAreaConfig.size),
      iinkSessionId: sessionId,
      applicationKey: this.appKey,
    })
  }

  public createContentPackage() {
    this.ws.send.newContentPackage({
      ...initialPackagePayload(this.drawAreaConfig.size),
      applicationKey: this.appKey,
    })
  }

  public debug() {
    this.ws.debug()
    return this
  }
}
