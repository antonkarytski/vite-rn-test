import { PrimitiveShapes } from '../units/shape'

type Extremum = {
  x0: number
  y0: number
  x1: number
  y1: number
}
export function getExtremum(points: number[][]) {
  return points.reduce(
    (extremum, point) => {
      extremum.x0 = Math.min(point[0], extremum.x0)
      extremum.y0 = Math.min(point[1], extremum.y0)
      extremum.x1 = Math.max(point[0], extremum.x1)
      extremum.y1 = Math.max(point[1], extremum.y1)
      return extremum
    },
    {
      x0: Infinity,
      y0: Infinity,
      x1: 0,
      y1: 0,
    }
  )
}

function mergeExtremum(e1: Extremum, e2: Extremum) {
  return {
    x0: Math.min(e1.x0, e2.x0),
    x1: Math.max(e1.x1, e2.x1),
    y0: Math.min(e1.y0, e2.y0),
    y1: Math.max(e1.y1, e2.y1),
  }
}

export function normalizePoints(
  points: number[][],
  extremum = getExtremum(points),
  withTimestamp = 0
) {
  const { x0, y0 } = extremum
  if (!withTimestamp) return points.map(([x, y, t]) => [x - x0, y - y0, t])
  let firstTimestamp: number
  return points.map(([x, y, t], index) => {
    if (index === 0) {
      firstTimestamp = t
      return [x - x0, y - y0, withTimestamp]
    }
    return [x - x0, y - y0, withTimestamp + firstTimestamp - t]
  })
}

export function normalizeGraphPart(
  points: number[][],
  extremum = getExtremum(points)
) {
  const { x0, y0 } = extremum
  const result = points.map(([x, y, t]) => [x - x0, y - y0, t])
  result.unshift([0, 0, result[0][2]])
  result.push([0, 0, result[result.length - 1][2]])
  return result
}

export function addEdges(points: number[][]) {
  const result = [...points]
  result.unshift([0, 0, result[0][2]])
  result.push([0, 0, result[result.length - 1][2]])
  return result
}

export function normalizeShapes(shapes: PrimitiveShapes) {
  if (!shapes.length) throw new Error('Shapes list should not be empty')
  const extremum = shapes.reduce((acc, shape) => {
    const result = getExtremum(shape)
    if (!acc) return result
    if (!result) return acc
    return mergeExtremum(acc, result)
  }, null)
  if (!extremum) throw new Error('Unexpected extremum')
  let nextShapeTimestamp = 0
  return shapes.map((shape) => {
    const points = normalizePoints(shape, extremum, nextShapeTimestamp)
    nextShapeTimestamp = points[points.length - 1][2] + 100
    return points
  })
}

export function sortShapesFromLeftToRight(shapes: PrimitiveShapes) {
  return [...shapes].sort((a, b) => {
    const aExtremum = getExtremum(a)
    const bExtremum = getExtremum(b)
    return aExtremum.x0 - bExtremum.x0
  })
}
