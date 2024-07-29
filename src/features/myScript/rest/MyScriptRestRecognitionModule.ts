import { computeHMAC } from '../../../lib/helpers/crypto'
import { MSExportType, RecognizedResponse } from '../types'
import { convertHistoryToMyScriptStrokes } from '../helpers'
import { attach, createEffect, Effect, Store } from 'effector'
import { DrawingHistory } from '../../handwriteRecognition/drawingsList/types'
import { createMyScriptRestConfig } from './config'

type MyScriptRestRecognitionModuleProps = {
  host: string
  appKey: string
  hmac: string
}

export class MyScriptRestRecognitionModule {
  public static urls = {
    batch: (host: string) => `${host}/api/v4.0/iink/batch`,
  }

  private $historyStore: Store<DrawingHistory | null> | null = null

  private readonly host: string
  private readonly appKey: string
  private readonly hmac: string
  public constructor({
    host,
    appKey,
    hmac,
  }: MyScriptRestRecognitionModuleProps) {
    this.host = host.endsWith('/') ? host.slice(0, -1) : host
    this.appKey = appKey
    this.hmac = hmac
  }

  private async prepareRequestHeaders(content: string) {
    const hmac = await computeHMAC(this.appKey, this.hmac, content)
    const headers = new Headers()
    headers.append('Accept', ['application/json', MSExportType.JIIX].join(','))
    headers.append('applicationKey', this.appKey)
    headers.append('hmac', hmac)
    headers.append('Content-Type', 'application/json')
    return headers
  }

  private createContent(history: DrawingHistory) {
    const strokes = convertHistoryToMyScriptStrokes(history)
    return JSON.stringify(createMyScriptRestConfig(strokes))
  }

  public bindHistoryStore($store: Store<DrawingHistory | null>) {
    this.$historyStore = $store
    this.recognizeCurrentHistory = attach({
      source: this.$historyStore,
      mapParams: (_: void, item) => item,
      effect: this.recognizeFx,
    })
    return this
  }

  public async recognize(history: DrawingHistory): Promise<RecognizedResponse> {
    const content = this.createContent(history)
    const headers = await this.prepareRequestHeaders(content)
    const response = await fetch(
      MyScriptRestRecognitionModule.urls.batch(this.host),
      {
        method: 'POST',
        headers,
        body: content,
      }
    )
    if (!response.ok) throw new Error(response.statusText)
    const responseType = response.headers.get('Content-Type')
    if (responseType === MSExportType.PNG) {
      return { png: await response.blob() }
    }
    if (responseType === MSExportType.LATEX) {
      return { latex: await response.text() }
    }
    return { jiix: await response.json() }
  }

  public readonly recognizeFx = createEffect(
    (history: DrawingHistory | null) => {
      if (!history) throw new Error('No drawing history')
      return this.recognize(history)
    }
  )

  public recognizeCurrentHistory: Effect<void, RecognizedResponse> =
    createEffect((): any => {
      throw new Error('Please bind history store first')
    })
}
