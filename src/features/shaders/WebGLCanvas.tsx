import React, { useState } from 'react'
import { WebGLBoardModel } from './model/WebGLBoardModel'

type WebGlCanvasProps = {
  model: WebGLBoardModel
}

const WebGlCanvas = ({ model: extModel }: WebGlCanvasProps) => {
  const [model] = useState(() => extModel || new WebGLBoardModel())

  return <canvas ref={model.setUp} />
}

export default WebGlCanvas
