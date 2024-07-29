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
