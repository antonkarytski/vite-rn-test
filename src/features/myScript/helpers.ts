import { MSPointType, MSStroke } from './types'
import { DrawingHistory } from '../handwriteRecognition/drawingsList/types'
import { JIIXExpressionType } from './types.jiix'

export const convertHistoryToMyScriptStrokes = (history: DrawingHistory) => {
  return history.shapes.map((shape, index) => {
    return shape.reduce<MSStroke>(
      (acc, [x, y, t]) => {
        acc.x.push(x)
        acc.y.push(y)
        acc.t.push(t)
        acc.p.push(1.0)
        return acc
      },
      {
        x: [],
        y: [],
        t: [],
        p: [],
        pointerType: MSPointType.PEN,
        id: index.toString(),
      }
    )
  })
}

export type JIIXExpressionTypeProps = {
  type: JIIXExpressionType
}
export const createJIIXCategorySorter = <T extends JIIXExpressionTypeProps>(
  group: JIIXExpressionType[]
) => {
  return (expression: JIIXExpressionTypeProps): expression is T =>
    group.includes(expression.type)
}
