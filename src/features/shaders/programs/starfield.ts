import { WebGLProgramPrototype } from '../model/WebGLProgramPrototype'
import { DrawType, ShadersDefaultVarNames } from '../constants'
import { WebGLBoardModel } from '../model/WebGLBoardModel'
import { WebGLSceneDrawer } from '../model/WebGLSceneDrawer'

type StartFieldContext = {
  numVerts: number
  vertexIds: Float32Array
}

const vertexShader = `
attribute float vertexId;
uniform float numVerts;
uniform vec2 u_resolution;
uniform float u_time;
 
#define PI radians(180.0)

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float hash(float p) {
  vec2 p2 = fract(vec2(p * 5.3983, p * 5.4427));
  p2 += dot(p2.yx, p2.xy + vec2(21.5351, 14.3137));
  return fract(p2.x * p2.y * 95.4337);
}

vec2 randomPosition(float id, float time) {
    // Mix the seed with time and ID more thoroughly to avoid visible patterns
    float n = noise(vec2(id * 14.123, time * 0.123) + vec2(time * id, id));
    return vec2(noise(vec2(n, n * 2.0)) * 2.0 - 1.0, noise(vec2(n * 3.0, n * 4.0)) * 2.0 - 1.0);
}

void main() {
  float id = float(vertexId);
  float seed = fract(vertexId);
  float u = id / numVerts;
  float xHash = hash(seed * u);
  float x = xHash * 2.0 - 1.0;             
  float y = hash(xHash) * -2.0 + 1.0;
  float z = fract(-u_time + u);

  gl_Position = vec4(x / z, y / z, 0, 1);
  gl_PointSize = 10.0 - z * 8.0;
}
  `

const fragmentShader = `
  precision mediump float;
  
  void main() {
    float radius = 0.5;
    float distanceFromCenter = distance(gl_PointCoord, vec2(0.5, 0.5));
    if(distanceFromCenter > radius) {
        discard;
    }
    gl_FragColor = vec4(0.9, 0.9, 1.0, 1.0);
  }
`

export const starFieldProgramProto = new WebGLProgramPrototype({
  vertexShader,
  fragmentShader,
  vars: {
    U_RESOLUTION: ShadersDefaultVarNames.U_RESOLUTION,
    A_POSITION: ShadersDefaultVarNames.A_POSITION,
  },
  context: WebGLProgramPrototype.createContext<StartFieldContext>(),
})

export const startFieldScene = new WebGLSceneDrawer({
  programProto: starFieldProgramProto,
  setUpFn: (model) => {
    model.setBackgroundColor(15, 15, 15, 1)
    starFieldProgramProto.setContext(() => {
      const numVerts = 2000
      const vertexIds = new Float32Array(numVerts)
      vertexIds.forEach((_, i) => {
        vertexIds[i] = i + Math.random()
      })

      return { numVerts, vertexIds }
    })
  },
  drawFn: (model, { time }) => {
    model.fitToDisplay()
    try {
      const gl = model.gl!
      model
        .attachProgram(starFieldProgramProto)
        .initResolutionUniform()
        .bindBuffer({
          toAttribute: 'vertexId',
          withSettings: {
            itemsPerOperation: 1,
          },
          withData: starFieldProgramProto.context.vertexIds,
          drawType: DrawType.STATIC_DRAW,
        })

      model.currentProgram?.forUniform('numVerts', (location) => {
        gl.uniform1f(location, starFieldProgramProto.context.numVerts)
      })
      model.currentProgram?.forUniform('u_time', (location) => {
        gl.uniform1f(location, time * 0.001)
      })
      gl.drawArrays(gl.POINTS, 0, starFieldProgramProto.context.numVerts)
    } catch (e) {
      console.log(e)
    }
  },
})
