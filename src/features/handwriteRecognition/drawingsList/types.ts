import { PrimitiveShapes } from '../../../lib/units/shape'

export type DrawingHistory = {
  shapes: PrimitiveShapes
  features: {
    pathCount: number
    pointCount: number
  }
  size: {
    width: number
    height: number
  }
  id: number
}
