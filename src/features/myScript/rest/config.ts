import { MSContentType, MSStroke } from '../types'

export const createMyScriptRestConfig = (strokes: MSStroke[]) => ({
  width: 0,
  height: 0,
  contentType: MSContentType.MATH,
  strokeGroups: [
    {
      strokes,
      penStyle: 'color: #000000;\n-myscript-pen-width: 0.625;',
    },
  ],
  xDPI: 96,
  yDPI: 96,
  gesture: {
    enable: true,
  },
  configuration: {
    math: {
      solver: {
        enable: false,
      },
      eraser: {
        'erase-precisely': false,
      },
    },
    export: {
      jiix: {
        strokes: true,
        'bounding-box': true,
        text: { words: true, chars: false },
      },
    },
  },
})
