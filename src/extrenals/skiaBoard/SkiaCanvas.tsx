import React, { useLayoutEffect, useRef } from 'react'
import { Skia } from './SkiaContext'

type SkiaCanvasProps = {}

const SkiaCanvas = ({}: SkiaCanvasProps) => {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useLayoutEffect(() => {
    const htmlCanvas = ref.current
    if (!htmlCanvas) return

    return Skia.onLoad((kit) => {
      console.log(kit)
      const paint = new kit.Paint()
      paint.setColor(kit.Color(223, 113, 38, 1.0))
      paint.setStrokeWidth(5)
      paint.setStyle(kit.PaintStyle.Stroke)

      const surface = kit.MakeWebGLCanvasSurface(htmlCanvas)
      const canvas = surface?.getCanvas()
      console.log(canvas)
      canvas?.drawCircle(50, 50, 50, paint)
      canvas?.drawRect([10, 10, 100, 100], paint)
    })
  }, [])

  return <canvas width={600} height={800} ref={ref} />
}

export default SkiaCanvas
