import { SocketManager } from '../../../lib/sockets/SocketManager'
import {
  ACKPayload,
  ContentPackageDescriptionPayload,
  ExportedPayload,
  NewPartPayload,
  PartChangedPayload,
  SVGPatchPayload,
} from './types/serverActions'
import { ISize } from '../../../lib/units/types'
import { MSConfiguration } from './types/config'
import {
  AddStrokesPayload,
  ConvertPayload,
  NewContentPackagePayload,
  NewContentPartPayload,
  OpenContentPartPayload,
  RestoreSessionPayload,
  SetPenStylePayload,
} from './types/clientActions'
import { typeActionCreator } from '../../../lib/sockets/helpers'

export const createMSSocketManager = () => {
  return new SocketManager({
    actionCreator: typeActionCreator,
    messages: ({ message }) => ({
      contentPackageDescription: message<ContentPackageDescriptionPayload>(),
      ack: message<ACKPayload>(),
      partChanged: message<PartChangedPayload>(),
      svgPatch: message<SVGPatchPayload>(),
      newPart: message<NewPartPayload>(),
      exported: message<ExportedPayload>(),
    }),
    actions: ({ message }) => ({
      waitForIdle: message<void>(),
      changeViewSize: message<ISize>(),
      clear: message<void>(),
      configuration: message<MSConfiguration>(),
      setPenStyle: message<SetPenStylePayload>(),
      convert: message<ConvertPayload>(),
      addStrokes: message<AddStrokesPayload>(),
      restoreSession: message<RestoreSessionPayload>('restoreIInkSession'),
      newContentPackage: message<NewContentPackagePayload>(),
      openContentPart: message<OpenContentPartPayload>(),
      newContentPart: message<NewContentPartPayload>(),
    }),
  })
}
