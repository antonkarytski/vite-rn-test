import React, { useCallback, useMemo } from 'react'
import { Stage } from 'react-konva'
import PointsRenderer from '../../canvas/PointsRenderer'
import { useStore } from 'effector-react'
import PrimitiveValueInput from './PrimitiveValueInput'
import { primitiveMarkupModel } from './model.primitiveMarkup'
import { useDrawingFit } from '../helpers.drawingFit'
import { usePrimitiveConvert } from '../../canvas/hook.convert'
import { ActivePrimitiveShape } from '../../canvas/types'
import { LinePosition, Shapes } from '../../../../lib/units/shapes'

type CurrentPrimitiveProps = {}

const PRIMITIVE_VIEW_SIZE = 200
const VIEW_PADDING = 2

const POSITION_COLOR_MAP = new Map([
  [LinePosition.HORIZONTAL, 'red'],
  [LinePosition.VERTICAL, 'blue'],
  [LinePosition.DIAGONAL_LR, 'green'],
  [LinePosition.DIAGONAL_RL, 'yellow'],
])
const PrimitiveMarkupBlock = ({}: CurrentPrimitiveProps) => {
  const primitives = useStore(primitiveMarkupModel.$selected)
  const descriptor = useDrawingFit({
    points: primitives ?? [],
    width: PRIMITIVE_VIEW_SIZE,
    height: PRIMITIVE_VIEW_SIZE,
    maxScale: 2,
  })

  const shapes = usePrimitiveConvert(primitives)

  if (!primitives) return null
  return (
    <div>
      <Stage
        scale={{ x: descriptor.scale, y: descriptor.scale }}
        offset={{
          x: (-VIEW_PADDING - descriptor.offset.x) / descriptor.scale,
          y: (-VIEW_PADDING - descriptor.offset.y) / descriptor.scale,
        }}
        width={PRIMITIVE_VIEW_SIZE + VIEW_PADDING * 2}
        height={PRIMITIVE_VIEW_SIZE + VIEW_PADDING * 2}
      >
        <PointsRenderer shapes={shapes} />
      </Stage>
      <PrimitiveValueInput />
    </div>
  )
}

export default PrimitiveMarkupBlock
