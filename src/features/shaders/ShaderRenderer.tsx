import React, { useEffect, useState } from 'react'
import { WebGLBoardModel } from './model/WebGLBoardModel'
import WebGlCanvas from './WebGLCanvas'
import { WebGLSceneDrawer } from './model/WebGLSceneDrawer'

type ShadersStarFieldProps = {
  scene: WebGLSceneDrawer
}

const ShaderRenderer = ({ scene }: ShadersStarFieldProps) => {
  const [model] = useState(() => new WebGLBoardModel())

  useEffect(() => {
    let stop: number
    scene.setUp(model)
    const loop = (time: number) => {
      scene.draw(model, { time })
      stop = requestAnimationFrame(loop)
    }

    stop = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(stop)
    }
  }, [model])

  return <WebGlCanvas model={model} />
}

export default ShaderRenderer
