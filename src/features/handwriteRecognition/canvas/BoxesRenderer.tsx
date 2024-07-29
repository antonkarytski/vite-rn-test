import React from 'react'
import { Layer, Rect } from 'react-konva'
import { IRect } from '../../../lib/units/types'
import { Vector2d } from 'konva/lib/types'

type BoxesRendererProps = {
  boxes: IRect[]
  scale?: Vector2d
}

const BoxesRenderer = ({ boxes, scale }: BoxesRendererProps) => {
  return (
    <Layer scale={scale}>
      {boxes.map((box, index) => {
        return (
          <Rect
            key={index}
            height={box.height / (scale?.x || 1)}
            width={box.width / (scale?.x || 1)}
            x={box.x / (scale?.x || 1)}
            y={box.y / (scale?.y || 1)}
            stroke={'rgba(255,0,0,0.5)'}
            fill={'rgba(255,0,0,0.1)'}
            strokeWidth={2}
            tension={0.5}
            lineCap='round'
            lineJoin='round'
            id={`box${index}`}
          />
        )
      })}
    </Layer>
  )
}

export default BoxesRenderer
