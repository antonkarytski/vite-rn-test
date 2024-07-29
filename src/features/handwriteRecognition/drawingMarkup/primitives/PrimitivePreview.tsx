import React from 'react'
import { Stage } from 'react-konva'
import PointsRenderer from '../../canvas/PointsRenderer'
import { useDrawingFit } from '../helpers.drawingFit'
import styles from '../styles.module.scss'
import { Button } from 'antd'
import { usePrimitiveConvert } from '../../canvas/hook.convert'

export type PrimitiveProto = {
  points: number[][][]
  value?: string
}

type PrimitivePreviewProps<T extends PrimitiveProto> = {
  width: number
  height: number
  item: T
  className?: string
  onMouseEnter?: (item: T) => void
  onPress?: (item: T) => void
  onRemovePress?: (item: T) => void
  label?: string
}

const PrimitivePreview = <T extends PrimitiveProto>({
  width,
  height,
  item,
  className,
  onMouseEnter,
  onPress,
  onRemovePress,
}: PrimitivePreviewProps<T>) => {
  const descriptor = useDrawingFit({ points: item.points, width, height })
  const shapes = usePrimitiveConvert(item.points)

  return (
    <div style={{ position: 'relative' }}>
      <Stage
        onClick={() => {
          onPress?.(item)
        }}
        onMouseEnter={() => onMouseEnter?.(item)}
        className={className}
        offset={{
          x: (-2 - descriptor.offset.x) / descriptor.scale,
          y: (-2 - descriptor.offset.y) / descriptor.scale,
        }}
        scale={{ x: descriptor.scale, y: descriptor.scale }}
        width={width + 4}
        height={height + 4}
      >
        <PointsRenderer shapes={shapes} />
      </Stage>
      {item.value && (
        <div className={styles.PrimitivePreviewValue}>{item.value}</div>
      )}
      {onRemovePress && (
        <Button
          onClick={() => onRemovePress(item)}
          className={styles.PrimitivePreviewRemoveButton}
        >
          <div>x</div>
        </Button>
      )}
    </div>
  )
}

export default PrimitivePreview
