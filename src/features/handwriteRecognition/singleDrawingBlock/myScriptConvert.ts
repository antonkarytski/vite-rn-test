import { HandwritePrimitive } from '../../../core/api/primitives.types'
import { JIIXPrimitiveObject } from '../../myScript/types.jiix'
import {
  convertGlyphPointsToPrimitive,
  getValueForJIIXGlyph,
} from '../../myScript/jiixParser'
import {
  normalizeShapes,
  sortShapesFromLeftToRight,
} from '../../../lib/drawings/helper.extremum'

type JIIXGlyphToPrimitiveSettings = {
  id: number
}

export const extractSubPrimitives = (primitive: HandwritePrimitive) => {
  const subPrimitives: HandwritePrimitive[] = []
  if (
    primitive.points.length > 1 &&
    primitive.points.length === primitive.value.length
  ) {
    const sorted = sortShapesFromLeftToRight(primitive.points)
    sorted.forEach((symbolPoints, index) => {
      subPrimitives.push({
        points: normalizeShapes([symbolPoints]),
        feature_path_count: '1',
        value: primitive.value[index],
        origin_drawing_id: primitive.origin_drawing_id,
        feature_points_count: symbolPoints.length.toString(),
      })
    })
    return subPrimitives
  }

  if (primitive.value === '=' && primitive.points.length === 2) {
    primitive.points.forEach((symbolPoints) => {
      subPrimitives.push({
        points: normalizeShapes([symbolPoints]),
        feature_path_count: '1',
        value: '-',
        origin_drawing_id: primitive.origin_drawing_id,
        feature_points_count: symbolPoints.length.toString(),
      })
    })
    return subPrimitives
  }
  return subPrimitives
}

export const convertJIIXGlyphToPrimitive = (
  glyph: JIIXPrimitiveObject,
  { id }: JIIXGlyphToPrimitiveSettings
): HandwritePrimitive[] => {
  const points: number[][][] = normalizeShapes(
    convertGlyphPointsToPrimitive(glyph)
  )
  const value = getValueForJIIXGlyph(glyph)
  if (!value) return []
  const generalPrimitive: HandwritePrimitive = {
    points,
    feature_path_count: glyph.items.length.toString(),
    value,
    origin_drawing_id: id.toString(),
    feature_points_count: points
      .reduce((acc, e) => acc + e.length, 0)
      .toString(),
  }
  const subs = extractSubPrimitives(generalPrimitive)
  return [generalPrimitive, ...subs]
}
