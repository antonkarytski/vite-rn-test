import React, { forwardRef } from 'react'
import { Layer, Line } from 'react-konva'
import Konva from 'konva'
import { PrimitiveShapes } from '../../../lib/units/shape'
import { ActivePrimitiveShape } from './types'

type ShapesRendererProps = {
  shapes: ActivePrimitiveShape[]
}

const PointsRenderer = forwardRef<Konva.Layer, ShapesRendererProps>(
  ({ shapes }: ShapesRendererProps, ref) => {
    return (
      <Layer ref={ref}>
        {shapes.map((shape, index) => {
          return (
            <Line
              name={'line'}
              key={index}
              points={shape.points.map(([x, y]) => [x, y]).flat()}
              stroke={shape.color || 'black'}
              strokeWidth={3}
              tension={0.5}
              lineCap='round'
              lineJoin='round'
              id={index.toString()}
            />
          )
        })}
      </Layer>
    )
  }
)

export default PointsRenderer
