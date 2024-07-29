import { attach, createEvent, Effect, restore } from 'effector'
import { addPrimitive } from '../../../../core/api/primitives'
import { PrimitiveShapes } from '../../../../lib/units/shape'
import { EffectorState, primitiveInput } from './model.primitiveInput'
import {
  currentDrawing,
  CurrentDrawingModel,
} from '../../singleDrawingBlock/model'

type PrimitiveMarkupModelProps = {
  drawingModel: CurrentDrawingModel
  inputModel: EffectorState<string>
}

export class PrimitiveMarkupModel {
  public readonly setSelectedPrimitives = createEvent<PrimitiveShapes | null>()
  public readonly $selected = restore(this.setSelectedPrimitives, null)

  public readonly sendCurrent: Effect<void, void>

  public constructor({ drawingModel, inputModel }: PrimitiveMarkupModelProps) {
    this.sendCurrent = attach({
      source: {
        history: drawingModel.$item,
        primitive: this.$selected,
        value: inputModel.$value,
      },
      mapParams: (_: void, { history, primitive, value }) => {
        if (!primitive || !history) throw new Error('history is null')
        return {
          points: primitive,
          origin_drawing_id: history.id.toString(),
          feature_path_count: primitive.length.toString(),
          feature_points_count: primitive
            .reduce((acc, part) => acc + part.length, 0)
            .toString(),
          value,
        }
      },
      effect: addPrimitive,
    })

    addPrimitive.done.watch(({ params }) => {
      drawingModel.addMarkedPrimitives(params)
    })

    drawingModel.$item.watch(() => {
      this.setSelectedPrimitives(null)
    })
  }
}

export const primitiveMarkupModel = new PrimitiveMarkupModel({
  drawingModel: currentDrawing,
  inputModel: primitiveInput,
})
