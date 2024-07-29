import React, { useState } from 'react'
import { SpongeSceneModel } from './SpongeSceneModel'

const SpongeScene = () => {
  const [model] = useState(() => new SpongeSceneModel())

  return <div ref={model.init} />
}

export default SpongeScene
