import {
  MSContentType,
  MSConversionState,
  MSExportType,
  MSStroke,
} from '../../types'

export type NewContentPackagePayload = {
  applicationKey: string
  xDpi: number
  yDpi: number
  viewSizeHeight: number
  viewSizeWidth: number
}
export type NewContentPartPayload = {
  contentType: MSContentType
  mimeTypes: MSExportType[]
}
export type OpenContentPartPayload = {
  id: string
  mimeTypes: MSExportType[]
}
export type AddStrokesPayload = {
  strokes: MSStroke[]
}
export type ConvertPayload = {
  partId: string
  conversionState: MSConversionState
}

export type RestoreSessionPayload = {
  iinkSessionId: string
} & NewContentPackagePayload

export type SetPenStylePayload = {
  style: string
}
