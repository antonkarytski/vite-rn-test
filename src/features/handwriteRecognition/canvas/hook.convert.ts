import { ActivePrimitiveShape } from './types'
import { useMemo } from 'react'

const defaultConverter = (
  shapes: number[][][] | null | undefined
): ActivePrimitiveShape[] => {
  if (!shapes) return []
  return shapes.map((points) => ({ points }))
}

export function usePrimitiveConvert(
  shapes: number[][][] | null | undefined,
  converter = defaultConverter
) {
  return useMemo(() => converter(shapes), [shapes, converter])
}
