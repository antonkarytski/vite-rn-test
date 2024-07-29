export type Context = CanvasRenderingContext2D

export type ICoords = {
  x: number
  y: number
}

export type IPoint = {
  t: number
} & ICoords

export type ISize = {
  width: number
  height: number
}

export type IRect = ICoords & ISize

export type IExtremum = {
  x0: number
  x1: number
  y0: number
  y1: number
}

export type SizeModifier = {
  left: number
  right: number
  top: number
  bottom: number
}

export type Extra = Record<string, any>
export type ExtraWithSubtype<T> = {
  sub: T
}

export type ITransform = {
  scale: number
  offset: ICoords
  size: ISize
}
export type TransformParams = {
  scale?: number
  offset?: ICoords | null
  size?: ISize | null
}
export type IPointDescription = {
  point: IPoint
  rotation?: number
}
export type CoordsMoveFn = (originalPoint: ICoords) => ICoords

export type IPaddings = {
  top: number
  left: number
  bottom: number
  right: number
}
