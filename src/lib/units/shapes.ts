import * as mg from '@mathigon/euclid'

export enum ShapeType {
  LINE = 'LINE',
}

export enum LinePosition {
  HORIZONTAL = 'HORIZONTAL',
  VERTICAL = 'VERTICAL',
  DIAGONAL_LR = 'DIAGONAL_LR',
  DIAGONAL_RL = 'DIAGONAL_RL',
}

type LineCategoryResponse = {
  type: ShapeType.LINE
  position: LinePosition
  instance: mg.Line
}

export type ShapeCategoryResponse = LineCategoryResponse

const getLinePositionFromSlope = (slopeRaw: number): LinePosition => {
  const slope = Math.abs(slopeRaw)
  if (slope < 0.5) return LinePosition.HORIZONTAL
  if (slope > 3.5) return LinePosition.VERTICAL
  if (slopeRaw > 0) return LinePosition.DIAGONAL_LR
  return LinePosition.DIAGONAL_RL
}

export class Shapes {
  public static categorizeLine(
    points: number[][]
  ): LineCategoryResponse | null {
    if (points.length < 2) return null
    const firstPoint = points[0]
    const lastPoint = points[points.length - 1]
    const line = new mg.Line(
      new mg.Point(firstPoint[0], firstPoint[1]),
      new mg.Point(lastPoint[0], lastPoint[1])
    )
    for (let i = 1; i < points.length - 2; i++) {
      const point = points[i]
      if (line.contains({ x: point[0], y: point[1] })) continue
      const perp = line.perpendicular(new mg.Point(point[0], point[1]))
      const threshold = line.length * 0.1
      if (perp.length > threshold) return null
    }
    const position = getLinePositionFromSlope(line.slope)
    return {
      type: ShapeType.LINE,
      position,
      instance: line,
    }
  }
}
