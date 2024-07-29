type KeyboardKey = {
  value: string | number
  color?: string
}

const BUTTONS_COLOR = {
  SYMBOL: '#e1d01d',
  ARROW: '#c2eff3',
  ERROR: '#e56161',
  SHAPE: '#afee97',
}

const createKeyboardKey = (
  value: string | number,
  { color }: Omit<KeyboardKey, 'value'> = {}
) => ({ value: value.toString(), color })

const createNumber = (value: number) => createKeyboardKey(value)
const createSymbol = (value: string) =>
  createKeyboardKey(value, { color: BUTTONS_COLOR.SYMBOL })

const createArrow = (value: string) =>
  createKeyboardKey(value, { color: BUTTONS_COLOR.ARROW })

const createError = (value: string) =>
  createKeyboardKey(value, { color: BUTTONS_COLOR.ERROR })

const createShape = (value: string) =>
  createKeyboardKey(value, { color: BUTTONS_COLOR.SHAPE })

export const KEYBOARD_KEYS = [
  [
    createNumber(1),
    createNumber(2),
    createNumber(3),
    createNumber(4),
    createNumber(5),
    createNumber(6),
    createNumber(7),
    createNumber(8),
    createNumber(9),
    createNumber(0),
    createNumber(5.1),
  ],
  [
    createSymbol('⏟'),
    createSymbol('≈'),
    createSymbol('∼'),
    createSymbol('∠'),
    createSymbol('∘'),
    createSymbol('√'),
    createSymbol('≥'),
    createSymbol('≤'),
    createSymbol('∑'),
    createSymbol('∞'),
  ],

  [
    createArrow('←'),
    createArrow('→'),
    createArrow('↑'),
    createArrow('↓'),
    createArrow('⟸'),
    createArrow('⟹'),
  ],
  [createError('Err'), createError('Ers'), createError('Sel')],
  [createShape('Sqr'), createShape('Hrt'), createShape('Face')],
]
