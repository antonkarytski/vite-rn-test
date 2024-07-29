import { CanvasModel } from '../../canvas/model'
import { sample } from 'effector'
import { normalizeShapes } from '../../../../lib/drawings/helper.extremum'
import { currentDrawing } from '../../singleDrawingBlock/model'
import { primitiveMarkupModel } from '../primitives/model.primitiveMarkup'

export const markupCanvasModel = new CanvasModel({
  $drawing: currentDrawing.$item,
})

sample({
  source: currentDrawing.$item,
  clock: markupCanvasModel.primitiveSelected,
  fn: (history, ids) => {
    if (!history) return []
    return history.shapes.filter((_, index) => ids.includes(index))
  },
}).watch((selected) => {
  if (!selected.length) {
    return primitiveMarkupModel.setSelectedPrimitives(null)
  }
  primitiveMarkupModel.setSelectedPrimitives(normalizeShapes(selected))
})
