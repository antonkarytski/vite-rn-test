import { ISize } from '../../../lib/units/types'
import {
  MSSocketConnection,
  MyScriptSocketConnectionProps,
} from './MSSocketConnection'

export class MSSinglePartRecognitionConnection extends MSSocketConnection {
  private _isConfigured = false
  public get isConfigured() {
    return this._isConfigured
  }

  public readonly action = {
    clear: this.ws.send.clear,
    waitForIdle: this.ws.send.waitForIdle,
    setPenStyle: this.ws.send.setPenStyle,
    convert: this.ws.send.convert,
    addStrokes: this.ws.send.addStrokes,
    changeViewSize: (size: ISize) => {
      this.drawAreaConfig.size = size
      this.ws.send.changeViewSize(size)
    },
  }

  public readonly ac = this.action

  public constructor(props: MyScriptSocketConnectionProps) {
    super(props)
    this.ws.closed.watch(() => {
      this.currentContentPart = ''
      this._isConfigured = false
    })

    this.ws.message.contentPackageDescription.watch((response) => {
      if (this.config) this.ws.send.configuration(this.config)
      if (!response.contentPartCount) {
        this.createContentPart()
          .then(() => {
            this.initPromise.resolve(response)
            this._isConfigured = true
          })
          .catch(() => this.initPromise.reject())
      } else if (this.currentContentPart) {
        this.openContentPart(this.currentContentPart)
          .then(() => {
            this._isConfigured = true
          })
          .catch(() => {})
      }
      this.ws.send.setPenStyle({
        style: 'color: #ff7314;\n-myscript-pen-width: 2;',
      })
      this.initPromise.resolve(response)
    })
  }

  public reconfigure() {
    if (!this.config) return
    this.ws.send.configuration(this.config)
    this.createContentPart.reject()
    return this.createContentPart()
  }
}
