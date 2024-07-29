import { WebGLProgramPrototype } from '../model/WebGLProgramPrototype'
import { WebGLBoardModel } from '../model/WebGLBoardModel'
import { ShadersDefaultVarNames } from '../constants'

const vertexShader = `
    attribute vec2 a_position;
    uniform vec2 u_resolution;
    
    void main() {
       vec2 clipSpace = (a_position / u_resolution) * 2.0 - 1.0;
       gl_Position = vec4(clipSpace, 0, 1.0);
    }
  `

const fragmentShader = `
  precision mediump float;
  uniform highp vec2 u_resolution;
  
  float gridSize = 75.0;
 
  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float lineThickness = 1.5; // Thickness of the line
    float moduloValueX = mod(gl_FragCoord.x, gridSize);
    float moduloValueY = mod(gl_FragCoord.y, gridSize);
    float c = (moduloValueX < lineThickness || moduloValueX > gridSize - lineThickness || moduloValueY < lineThickness || moduloValueY > gridSize - lineThickness) ? 0.0 : 1.0;
    gl_FragColor = vec4(c, c, c, 1.0);
  }
`

export const gridProgramProto = new WebGLProgramPrototype({
  vertexShader,
  fragmentShader,
  vars: {
    U_RESOLUTION: ShadersDefaultVarNames.U_RESOLUTION,
    A_POSITION: ShadersDefaultVarNames.A_POSITION,
  },
})

export const drawGridWithWebGL = (model: WebGLBoardModel) => {
  const rect = model.fitToDisplay().createCanvasSizeRectMatrix()
  model
    .attachProgram(gridProgramProto)
    .bindBuffer({
      withData: new Float32Array(rect),
      toAttribute: gridProgramProto.vars.A_POSITION,
    })
    .initResolutionUniform()

  model.gl?.drawArrays(model.gl.TRIANGLE_STRIP, 0, rect.length / 2)
}
