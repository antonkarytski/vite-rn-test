import React from 'react'
import ShaderRenderer from '../features/shaders/ShaderRenderer'
import { startFieldScene } from '../features/shaders/programs/starfield'

const ShadersScreen = ({}) => {
  return <ShaderRenderer scene={startFieldScene} />
}

export default ShadersScreen
