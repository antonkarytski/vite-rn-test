import { WebGLProgramPrototype } from './WebGLProgramPrototype'
import { WebGLBoardModel } from './WebGLBoardModel'

export type DrawFnSettings = {
  time: number
}

type SceneDrawerProps = {
  programProto: WebGLProgramPrototype
  setUpFn: (model: WebGLBoardModel) => void
  drawFn: (model: WebGLBoardModel, settings: DrawFnSettings) => void
}

export class WebGLSceneDrawer {
  public readonly programProto: WebGLProgramPrototype
  public readonly setUp: (model: WebGLBoardModel) => void
  public readonly draw: (
    model: WebGLBoardModel,
    settings: DrawFnSettings
  ) => void

  public constructor({ programProto, setUpFn, drawFn }: SceneDrawerProps) {
    this.programProto = programProto
    this.setUp = setUpFn
    this.draw = drawFn
  }
}
