import { useMemo } from 'react'
import { Extremum } from '../../../lib/units/extremum'

type DrawingFitProps = {
  width: number
  height: number
  points: number[][][]
  maxScale?: number
}
export function useDrawingFit({
  width,
  points,
  height,
  maxScale = 1,
}: DrawingFitProps) {
  return useMemo(() => {
    const extremum = Extremum.fromShapes(points)
    if (!extremum) {
      return {
        scale: 1,
        size: { width: 0, height: 0 },
        offset: { x: 0, y: 0 },
      }
    }
    const size = new Extremum(extremum).getSize()
    const scale = Math.min(width / size.width, height / size.height, maxScale)
    return {
      scale,
      size,
      offset: {
        x: (width - size.width * scale) / 2,
        y: (height - size.height * scale) / 2,
      },
    }
  }, [width, height, points, maxScale])
}
