type WebGLProgramPrototypeProps<
  Ctx extends Record<string, any>,
  V extends Record<string, string>,
> = {
  vertexShader: string
  fragmentShader: string
  vars: V
  context?: Ctx
}

export class WebGLProgramPrototype<
  Ctx extends Record<string, any> = Record<string, any>,
  T extends Record<string, string> = Record<string, string>,
> {
  public static createContext = <T extends Record<string, any>>(
    initialValue?: T
  ) => {
    return initialValue || ({} as T)
  }

  public readonly vertexShader: string
  public readonly fragmentShader: string
  public readonly vars: T
  public context: Ctx

  public constructor({
    vars,
    fragmentShader,
    vertexShader,
    context,
  }: WebGLProgramPrototypeProps<Ctx, T>) {
    this.vertexShader = vertexShader
    this.fragmentShader = fragmentShader
    this.vars = vars
    this.context = context || ({} as Ctx)
  }

  public setContext(context: (current: Ctx) => Ctx) {
    this.context = context(this.context)
  }
}
