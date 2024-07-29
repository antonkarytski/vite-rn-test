import { api } from './api'
import { HandwritePrimitive } from './primitives.types'

const primitives = api.endpoint('primitives')
export const addPrimitive = primitives.post<void, HandwritePrimitive>()
export const addPrimitivesList = primitives.post<void, HandwritePrimitive[]>(
  'all'
)
export const getByOriginDrawingId = primitives.get<
  HandwritePrimitive[],
  string
>((id) => id)
