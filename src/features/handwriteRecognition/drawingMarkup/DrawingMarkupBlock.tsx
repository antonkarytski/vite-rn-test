import React from 'react'
import styles from './styles.module.scss'
import DrawingMarkupBoard from './board/DrawingMarkupBoard'
import PrimitiveMarkupBlock from './primitives/PrimitiveMarkupBlock'
import PrimitivesList from './primitives/PrimitivesList'
import { clsx } from 'clsx'
import { currentDrawing } from '../singleDrawingBlock/model'
import { HandwritePrimitive } from '../../../core/api/primitives.types'
import { Store } from 'effector'
import { PrimitiveProto } from './primitives/PrimitivePreview'
import { normalizePoints } from '../../../lib/drawings/helper.extremum'
import { primitiveMarkupModel } from './primitives/model.primitiveMarkup'
import { $normalizedDrawingPrimitives } from './primitives/model.drawingPrimitives'
import { Button } from 'antd'

type DrawingMarkupProps = {
  className?: string
}

const DrawingMarkupBlock = ({ className }: DrawingMarkupProps) => {
  return (
    <div className={clsx(styles.MarkupBlockContainer, className)}>
      <div className={styles.MarkupBlock}>
        <DrawingMarkupBoard />
        <PrimitivesList
          onItemPress={(item) => {
            primitiveMarkupModel.setSelectedPrimitives(item.points)
          }}
          $list={$normalizedDrawingPrimitives}
        />
        <PrimitivesList
          title={'Recognized'}
          $list={currentDrawing.$markedPrimitives}
        />
        <PrimitivesList
          onItemRemovePress={(item) =>
            currentDrawing.removeConvertedGlyph(item)
          }
          title={'Candidates'}
          $list={currentDrawing.$convertedGlyphs}
        />
      </div>
      <div className={styles.PreviewBlock}>
        <PrimitiveMarkupBlock />
      </div>
    </div>
  )
}

export default DrawingMarkupBlock
