import { MSExportType } from '../../types'

export type ACKPayload = {
  iinkSessionId: string
}
export type PartChangedPayload = {
  partInx: number
  partId: string
  partCount: number
}
export type NewPartPayload = {
  id: string
}
export type SVGUpdate = {
  type: string
  svg: string
}
export type SVGPatchPayload = {
  layer: string
  updates: SVGUpdate[]
}

export type ExportedPayload = {
  exports: {
    [key in MSExportType]: string
  }
}
export type ContentPackageDescriptionPayload = {
  contentPartCount: number
}
