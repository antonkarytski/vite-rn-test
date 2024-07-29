import {
  JIIXExpression,
  JIIXExpressionType,
  JIIXGroupExpression,
  JIIXOperatorExpression,
  JIIXPrimitiveObject,
  JIIXValueExpression,
} from './types.jiix'
import { ICoords, IRect } from '../../lib/units/types'
import { Coords } from '../../lib/units/coords'
import { createJIIXCategorySorter } from './helpers'

const isOperand = createJIIXCategorySorter<JIIXOperatorExpression>([
  JIIXExpressionType.PLUS,
  JIIXExpressionType.EQUAL,
  JIIXExpressionType.MINUS,
  JIIXExpressionType.MULTIPLY_DOT,
  JIIXExpressionType.COLON,
  JIIXExpressionType.FRACTION,
  JIIXExpressionType.DIVIDE,
  JIIXExpressionType.MORE_THAN,
  JIIXExpressionType.LESS_THAN,
])

const isGroup = createJIIXCategorySorter<JIIXGroupExpression>([
  JIIXExpressionType.GROUP,
  JIIXExpressionType.POWER,
  JIIXExpressionType.SUBSCRIPT,
  JIIXExpressionType.SUB_SUPERSCRIPT,
  JIIXExpressionType.SUPERSCRIPT,
  JIIXExpressionType.OVER_SCRIPT,
])

const isValue = createJIIXCategorySorter<JIIXValueExpression>([
  JIIXExpressionType.NUMBER,
  JIIXExpressionType.SYMBOL,
])

export const getPrimitivesFromJIIX = (
  expressions: JIIXExpression[]
): JIIXPrimitiveObject[] => {
  return expressions
    .map((expression) => {
      if (isGroup(expression)) {
        return getPrimitivesFromJIIX(expression.operands)
      }
      if (isOperand(expression)) {
        const { operands, ...operandPrimitive } = expression
        const primitives = getPrimitivesFromJIIX(expression.operands)
        return [operandPrimitive as JIIXPrimitiveObject, ...primitives]
      }
      if (isValue(expression)) {
        if (expression.error) return []
        return [expression as JIIXPrimitiveObject]
      }
      return []
    })
    .flat()
}

type TransformProps = {
  scale: number
  offset?: ICoords
}
export const transformJIIXBoxes = <T extends { 'bounding-box': IRect }>(
  glyph: T,
  { scale, offset = Coords.zero() }: TransformProps
): T => {
  glyph['bounding-box'].x = (glyph['bounding-box'].x - offset.x) * scale
  glyph['bounding-box'].y = (glyph['bounding-box'].y - offset.y) * scale
  glyph['bounding-box'].width = glyph['bounding-box'].width * scale
  glyph['bounding-box'].height = glyph['bounding-box'].height * scale
  return glyph
}

const OPERATOR_REGEX = /[-+*\/=:·<>]/
export function getValueForJIIXGlyph(glyph: JIIXPrimitiveObject) {
  if (isValue(glyph)) return glyph.label
  if (OPERATOR_REGEX.exec(glyph.type)) return glyph.type
  if (glyph.type === JIIXExpressionType.FRACTION) return '_'
  return ''
}

export const MM_TO_PX = 96 / 25.4

export function convertGlyphPointsToPrimitive(
  glyph: JIIXPrimitiveObject
): [number, number, number][][] {
  return glyph.items.map(({ X, Y, T }) =>
    X.map((xVal, i) => [xVal * MM_TO_PX, Y[i] * MM_TO_PX, T[i]])
  )
}
