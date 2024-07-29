export class WebGLProgramController {
  private readonly gl: WebGLRenderingContext
  public readonly instance: WebGLProgram

  private vars: Record<string, WebGLUniformLocation | number | null> = {}

  private initVarLocation(name: string, type: 'uniform' | 'attribute') {
    if (type === 'uniform') {
      return (this.vars[name] = this.gl.getUniformLocation(this.instance, name))
    }
    return (this.vars[name] = this.gl.getAttribLocation(this.instance, name))
  }

  public getVarLocation(name: string, type: 'uniform'): WebGLUniformLocation
  public getVarLocation(name: string, type: 'attribute'): number
  public getVarLocation(name: string, type: 'uniform' | 'attribute') {
    return this.vars[name] || this.initVarLocation(name, type)
  }

  public constructor(instance: WebGLProgram, gl: WebGLRenderingContext) {
    this.instance = instance
    this.gl = gl
  }

  public forUniform(
    name: string,
    fn: (location: WebGLUniformLocation) => void
  ) {
    const location = this.getVarLocation(name, 'uniform')
    if (location) fn(location)
    return this
  }

  public forAttribute(name: string, fn: (location: number) => void) {
    const location = this.getVarLocation(name, 'attribute')
    if (location !== -1) fn(location)
    return this
  }
}
