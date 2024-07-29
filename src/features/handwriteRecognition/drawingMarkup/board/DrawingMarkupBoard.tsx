import React, { useCallback, useMemo } from 'react'
import { Stage } from 'react-konva'
import { useStore } from 'effector-react'
import PointsRenderer from '../../canvas/PointsRenderer'
import styles from '../styles.module.scss'
import {
  currentDrawing,
  selectedItemAttrsRef,
} from '../../singleDrawingBlock/model'
import { markupCanvasModel } from './model.canvas'
import BoxesRenderer from '../../canvas/BoxesRenderer'
import { ActivePrimitiveShape } from '../../canvas/types'
import { LinePosition, Shapes } from '../../../../lib/units/shapes'
import { usePrimitiveConvert } from '../../canvas/hook.convert'

const POSITION_COLOR_MAP = new Map([
  [LinePosition.HORIZONTAL, 'red'],
  [LinePosition.VERTICAL, 'blue'],
  [LinePosition.DIAGONAL_LR, 'green'],
  [LinePosition.DIAGONAL_RL, 'yellow'],
])
const DrawingMarkupBoard = () => {
  const selected = useStore(currentDrawing.$item)
  const glyphs = useStore(currentDrawing.$glyphs)

  const size = selected?.size || { width: 0, height: 0 }

  const boxes = useMemo(
    () => glyphs.map((glyph) => glyph['bounding-box']),
    [glyphs]
  )

  const converter = useCallback(() => {
    if (!selected?.shapes) return []
    return selected.shapes.map((points): ActivePrimitiveShape => {
      const lineCategory = Shapes.categorizeLine(points)
      return {
        points,
        color: lineCategory
          ? POSITION_COLOR_MAP.get(lineCategory.position)
          : 'black',
      }
    })
  }, [selected?.shapes])

  const shapes = usePrimitiveConvert(selected?.shapes, converter)

  return (
    <Stage
      className={styles.MarkupBoard}
      onMouseDown={markupCanvasModel.onActionDown}
      onMouseMove={markupCanvasModel.onActionMove}
      onMouseUp={markupCanvasModel.onActionEnd}
      ref={markupCanvasModel.initStage}
      scale={selectedItemAttrsRef.scale}
      offset={{
        x:
          -(500 - size.width * selectedItemAttrsRef.scale.x) /
          selectedItemAttrsRef.scale.x /
          2,
        y:
          -(400 - size.height * selectedItemAttrsRef.scale.y) /
          selectedItemAttrsRef.scale.y /
          2,
      }}
      width={500}
      height={400}
    >
      <PointsRenderer ref={markupCanvasModel.initLayer} shapes={shapes} />
      <BoxesRenderer boxes={boxes} scale={selectedItemAttrsRef.scale} />
    </Stage>
  )
}

export default DrawingMarkupBoard
