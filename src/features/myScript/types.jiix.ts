import { IRect } from '../../lib/units/types'

enum JIIXErrors {
  UNSOLVED = 'Unsolved',
}

export enum JIIXExpressionType {
  NUMBER = 'number',
  FRACTION = 'fraction',
  POWER = 'power',
  GLYPH = 'glyph',
  STROKE = 'glyph',
  GROUP = 'group',
  SUBSCRIPT = 'subscript',
  SUB_SUPERSCRIPT = 'subsuperscript',
  SUPERSCRIPT = 'superscript',
  OVER_SCRIPT = 'overscript',
  SYMBOL = 'symbol',
  EQUAL = '=',
  DIVIDE = '/',
  PLUS = '+',
  MINUS = '-',
  COLON = ':',
  MULTIPLY_DOT = '·',
  MORE_THAN = '>',
  LESS_THAN = '<',
}

type JIIXBaseExpression<N extends JIIXExpressionType, P extends object> = {
  type: N
  id: string
  'bounding-box': IRect
} & P

type JIIXBaseExpressionError<
  N extends JIIXExpressionType,
  E extends JIIXErrors,
  P extends object,
> = {
  type: N
  error: E
  generated: true
} & P

export type JIIXGlyphItem = JIIXBaseExpression<
  JIIXExpressionType.GLYPH,
  {
    label: string
    timestamp: string
  }
>

export type JIIXStrokeItem = JIIXBaseExpression<
  JIIXExpressionType.STROKE,
  {
    F: number[]
    T: number[]
    X: number[]
    Y: number[]
    timestamp: string
  }
>

export type JIIXPrimitive = JIIXGlyphItem | JIIXStrokeItem

export type JIIXValueType =
  | JIIXExpressionType.NUMBER
  | JIIXExpressionType.SYMBOL

export type JIIXCorrectValueExpression = JIIXBaseExpression<
  JIIXValueType,
  {
    error?: never
    label: string
    value?: number
    items: JIIXPrimitive[]
  }
>

export type JIIXErrorValueExpression = JIIXBaseExpressionError<
  JIIXValueType,
  JIIXErrors.UNSOLVED,
  {
    label: string
  }
>

export type JIIXValueExpression =
  | JIIXCorrectValueExpression
  | JIIXErrorValueExpression

export type JIIXOperatorExpression = JIIXBaseExpression<
  | JIIXExpressionType.PLUS
  | JIIXExpressionType.EQUAL
  | JIIXExpressionType.COLON
  | JIIXExpressionType.MINUS
  | JIIXExpressionType.MULTIPLY_DOT
  | JIIXExpressionType.FRACTION
  | JIIXExpressionType.DIVIDE,
  {
    items: JIIXPrimitive[]
    operands: JIIXExpression[]
  }
>

export type JIIXGroupExpression = JIIXBaseExpression<
  | JIIXExpressionType.GROUP
  | JIIXExpressionType.POWER
  | JIIXExpressionType.OVER_SCRIPT
  | JIIXExpressionType.SUBSCRIPT
  | JIIXExpressionType.SUB_SUPERSCRIPT
  | JIIXExpressionType.SUPERSCRIPT,
  {
    operands: JIIXExpression[]
  }
>

export type JIIXExpression =
  | JIIXGroupExpression
  | JIIXValueExpression
  | JIIXOperatorExpression

export type JIIXPrimitiveObject = Omit<
  JIIXCorrectValueExpression | JIIXOperatorExpression,
  'operands' | 'items'
> & {
  items: JIIXStrokeItem[]
}
