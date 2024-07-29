import { attach, createEffect, createEvent, Effect, Store } from 'effector'
import { JIIXResponse, MSExportType, RecognizedResponse } from '../types'
import { MS_SOCKET_CONFIG } from './config'
import { INITIAL_CONTENT_SIZE } from './helpers.socket'
import { MSSinglePartRecognitionConnection } from './MSSinglePartRecognitionConnection'
import { convertHistoryToMyScriptStrokes } from '../helpers'
import { Extremum } from '../../../lib/units/extremum'
import { Size } from '../../../lib/units/size'
import { WatchersList } from '../../../lib/models/WatchersList'
import { DrawingHistory } from '../../handwriteRecognition/drawingsList/types'
import { WSPromise } from '../../../lib/sockets/WSPromise'

type ModuleSettings = {
  grammarId?: string
}

type MyScriptRecognitionModuleProps = {
  host: string
  appKey: string
}

export class MSRecognitionModule {
  private $historyStore: Store<DrawingHistory | null> | null = null
  private readonly connection: MSSinglePartRecognitionConnection
  private readonly watchers = new WatchersList()

  private currentDrawerSize = INITIAL_CONTENT_SIZE
  private currentPartId: string | null = null

  public readonly recognisedAnswer = createEvent<RecognizedResponse>()

  private readonly recognizePromise = new WSPromise<RecognizedResponse>()
  public constructor({ host, appKey }: MyScriptRecognitionModuleProps) {
    this.connection = new MSSinglePartRecognitionConnection({ appKey, host })
      .setConfig(MS_SOCKET_CONFIG)
      .setDrawAreaConfig({ size: this.currentDrawerSize })
      .debug()

    this.recognisedAnswer.watch((e) => {
      this.recognizePromise.resolve(e)
    })
  }

  private async preRequestPrepare() {
    if (!this.connection.isOpened) {
      await this.connection.reInit(this.currentPartId)
    }
    if (!this.currentPartId) {
      const { id } = await this.connection.createContentPart()
      this.currentPartId = id
    }
  }

  public readonly recognize = createEffect(
    async (history: DrawingHistory | null) => {
      if (!history) throw new Error('No drawing history')
      this.recognizePromise.reject()
      await this.preRequestPrepare()
      return this.recognizePromise.start(() => {
        const strokes = convertHistoryToMyScriptStrokes(history)
        const size =
          Extremum.fromHistory(history.shapes)?.getSize() || history.size
        this.connection.action.clear()
        if (Size.isBigger(size, this.currentDrawerSize)) {
          this.currentDrawerSize = size
          this.connection.action.changeViewSize(size)
        }
        this.connection.action.addStrokes({ strokes })
      })
    }
  )

  public bindHistoryStore($store: Store<DrawingHistory | null>) {
    this.$historyStore = $store
    this.recognizeCurrentHistory = attach({
      source: this.$historyStore,
      mapParams: (_: void, item) => item,
      effect: this.recognize,
    })
    return this
  }

  public recognizeCurrentHistory: Effect<void, RecognizedResponse> =
    createEffect((): any => {
      throw new Error('Please bind history store first')
    })

  public readonly start = (settings?: ModuleSettings) => {
    if (settings?.grammarId) {
      this.connection.setGrammarId(settings.grammarId)
    }
    this.connection.start()
    this.watchers.add(
      this.connection.message.newPart.watch(({ id }) => {
        this.currentPartId = id
      }),
      this.connection.message.exported.watch((payload) => {
        const jiixString = payload.exports[MSExportType.JIIX]
        this.recognisedAnswer({
          jiix: jiixString
            ? (JSON.parse(jiixString) as JIIXResponse)
            : undefined,
        })
      })
    )
    return this
  }

  public setGrammarId(id: string) {
    this.connection.setGrammarId(id)
    if (this.connection.isOpened && this.connection.isConfigured) {
      this.connection.reconfigure()
    }
  }

  public readonly stop = () => {
    this.connection.stop()
  }

  public debug() {
    this.connection.debug()
    return this
  }
}
