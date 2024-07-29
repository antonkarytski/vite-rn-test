import { currentDrawing } from '../../singleDrawingBlock/model'
import { PrimitiveProto } from './PrimitivePreview'
import { normalizePoints } from '../../../../lib/drawings/helper.extremum'

export const $normalizedDrawingPrimitives = currentDrawing.$item.map(
  (history) => {
    if (!history) return [] as PrimitiveProto[]
    return history.shapes.map((shape) => ({
      points: [normalizePoints(shape)],
    }))
  }
)
