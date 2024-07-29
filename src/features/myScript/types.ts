import { IRect } from '../../lib/units/types'
import { JIIXExpression } from './types.jiix'

export enum MSPointType {
  PEN = 'PEN',
  ERASER = 'ERASER',
  MOUSE = 'MOUSE',
}

export enum MSExportType {
  LATEX = 'application/x-latex',
  JIIX = 'application/vnd.myscript.jiix',
  MATHML = 'application/mathml+xml',
  PNG = 'image/png',
}

export type MSMathConfiguration = {
  eraser?: {
    ['erase-precisely']?: boolean
  }
  solver?: {
    'fractional-part-digits'?: number
    'decimal-separator'?: string
    'rounding-mode'?: string
    'angle-unit'?: string
    enable?: boolean
  }
  margin?: {
    top?: number
    left?: number
    right?: number
  }
  customGrammarId?: string
  customGrammarContent?: string
}
export type MSExportConfiguration = {
  'image-resolution'?: number
  jiix?: {
    'bounding-box'?: boolean
    text?: {
      chars?: boolean
      words?: boolean
    }
    strokes?: boolean
  }
}

export type MSConfiguration = {
  math?: MSMathConfiguration
  export?: MSExportConfiguration
}

export enum MSContentType {
  MATH = 'Math',
  TEXT = 'Text',
  RAW = 'Raw Content',
}

export enum MSConversionState {
  DIGITAL_EDIT = 'DIGITAL_EDIT',
}

export type MSStroke = {
  x: number[]
  y: number[]
  t: number[]
  p: number[]
  id: string
  pointerType: MSPointType
  type?: 'stroke'
}
export type JIIXResponse = {
  'bounding-box': IRect
  expressions: JIIXExpression[]
  id: string
  type: MSContentType
  version: string
}
export type RecognizedResponse = {
  latex?: string
  jiix?: JIIXResponse
  png?: Blob
}
