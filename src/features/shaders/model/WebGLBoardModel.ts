import { WebGLProgramController } from './WebGLProgramController'
import { WebGLProgramPrototype } from './WebGLProgramPrototype'
import { DrawType, ShadersDefaultVarNames, WebGLVarType } from '../constants'
import { createRectDrawMatrix } from '../helpers'

type BufferToAttributeSettings = {
  itemsPerOperation?: number
  type?: WebGLVarType
  normalize?: boolean
}

type BindBufferProps = {
  withData?: Float32Array
  toAttribute?: string
  withSettings?: BufferToAttributeSettings
  drawType?: DrawType
}

function normalizeByteColor(color: number) {
  return color / 255
}

export class WebGLBoardModel {
  private currentProto: WebGLProgramPrototype | null = null
  public currentProgram: WebGLProgramController | null = null
  private bgColor = [255, 255, 255, 1]

  private canvas: HTMLCanvasElement | null = null
  public gl: WebGLRenderingContext | null = null
  public readonly setUp = (canvas: HTMLCanvasElement | null) => {
    this.canvas = canvas
    if (!this.canvas) {
      this.gl = null
      return
    }
    this.gl = this.canvas.getContext('webgl')
  }

  public fitToDisplay() {
    if (
      !this.canvas ||
      !this.gl ||
      (this.canvas.width === window.innerWidth &&
        this.canvas.height === window.innerHeight)
    ) {
      return this
    }
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
    return this
  }

  public createShader(source: string, type: number) {
    const shader = this.gl?.createShader(type)
    if (!shader || !this.gl) return
    this.gl.shaderSource(shader, source)
    this.gl.compileShader(shader)
    const success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)
    if (success) return shader
    console.warn(this.gl.getShaderInfoLog(shader))
    this.gl.deleteShader(shader)
  }

  public createShaderProgram(proto: WebGLProgramPrototype<any>) {
    const program = this.gl?.createProgram()
    if (!program || !this.gl) {
      throw new Error(
        'Error creating buffer: either no program or no WebGL context'
      )
    }
    const gl = this.gl
    const vertex = this.createShader(proto.vertexShader, gl.VERTEX_SHADER)
    if (vertex) gl.attachShader(program, vertex)
    const fragment = this.createShader(proto.fragmentShader, gl.FRAGMENT_SHADER)
    if (fragment) gl.attachShader(program, fragment)
    gl.linkProgram(program)
    const success = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (success) return new WebGLProgramController(program, this.gl)
    const log = gl.getProgramInfoLog(program)
    gl.deleteProgram(program)
    throw new Error(
      'Program creation failed: no success and no error log available:' + log
    )
  }

  public bindBuffer({
    withData,
    toAttribute,
    withSettings,
    drawType = DrawType.DYNAMIC_DRAW,
  }: BindBufferProps = {}) {
    const buffer = this.gl?.createBuffer()
    if (!buffer || !this.gl) {
      throw new Error(
        'Error creating buffer: either no buffer or no WebGL context'
      )
    }
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)
    if (withData) {
      this.gl.bufferData(
        this.gl.ARRAY_BUFFER,
        new Float32Array(withData),
        drawType
      )
    }
    if (toAttribute) {
      this.bufferToAttribute(toAttribute, withSettings)
    }
    return this
  }

  public attachProgram(proto: WebGLProgramPrototype) {
    if (!this.gl) throw new Error('No WebGL context')
    if (proto !== this.currentProto || !this.currentProgram) {
      if (this.currentProgram) {
        this.gl.deleteProgram(this.currentProgram.instance)
      }
      this.currentProgram = this.createShaderProgram(proto)
      this.currentProto = proto
    }
    this.gl.clearColor(
      this.bgColor[0],
      this.bgColor[1],
      this.bgColor[2],
      this.bgColor[3]
    )
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    this.gl.useProgram(this.currentProgram.instance)
    return this
  }

  public setBackgroundColor(r: number, g: number, b: number, a = 1) {
    if (!this.gl) throw new Error('No WebGL context')
    this.bgColor = [
      normalizeByteColor(r),
      normalizeByteColor(g),
      normalizeByteColor(b),
      a,
    ]
    return this
  }

  public initResolutionUniform(
    varName: string = ShadersDefaultVarNames.U_RESOLUTION
  ) {
    const gl = this.gl
    if (!this.currentProgram || !gl) throw new Error('Attach program first')
    this.currentProgram.forUniform(varName, (location) => {
      gl.uniform2f(location, gl.canvas.width, gl.canvas.height)
    })
    return this
  }

  public bufferToAttribute(
    attributeName: string,
    {
      itemsPerOperation = 2,
      type = WebGLVarType.FLOAT,
      normalize = false,
    }: BufferToAttributeSettings = {}
  ) {
    const gl = this.gl
    if (!this.currentProgram || !gl) throw new Error('Attach program first')
    this.currentProgram.forAttribute(attributeName, (location) => {
      gl.enableVertexAttribArray(location)
      gl.vertexAttribPointer(location, itemsPerOperation, type, normalize, 0, 0)
    })
    return this
  }

  public createCanvasSizeRectMatrix() {
    if (!this.gl) throw new Error('No WebGL context')
    return createRectDrawMatrix(this.gl.canvas.width, this.gl.canvas.height)
  }
}
