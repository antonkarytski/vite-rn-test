import { MSConfiguration, MSContentType, MSExportType } from '../types'

export const MS_SOCKET_CONFIG: MSConfiguration = {
  math: {
    eraser: {
      'erase-precisely': false,
    },
    solver: {
      enable: false,
    },
  },
  export: {
    jiix: {
      strokes: true,
      'bounding-box': false,
    },
  },
}
export const CONTENT_PART_CONFIG = {
  contentType: MSContentType.MATH,
  mimeTypes: [MSExportType.JIIX],
}
