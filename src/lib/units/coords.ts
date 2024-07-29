import { CoordsMoveFn, ICoords, IRect, ISize } from './types'

type NormalizeSettings = {
  start: ICoords
  scale?: number
  padding?: ICoords
}
export class Coords {
  public static createMoveAction = (action: CoordsMoveFn) => action
  public static distanceBetween(p1: ICoords, p2: ICoords | null | undefined) {
    return p2 ? Math.hypot(p1.x - p2.x, p1.y - p2.y) : 0
  }
  public static round(coords: ICoords, accuracy = 100) {
    return {
      x: Math.round((coords.x + Number.EPSILON) * accuracy) / accuracy,
      y: Math.round((coords.y + Number.EPSILON) * accuracy) / accuracy,
    }
  }
  public static zero(): ICoords {
    return { x: 0, y: 0 }
  }
  public static instance(x: number, y: number): ICoords {
    return { x, y }
  }
  public static convertToAbsolute(
    point: ICoords,
    scale: number,
    offset: ICoords
  ): ICoords {
    return {
      x: point.x * scale + offset.x,
      y: point.y * scale + offset.y,
    }
  }

  public static convertToRelative(
    point: ICoords,
    scale: number,
    offset: ICoords
  ): ICoords {
    return {
      x: (point.x - offset.x) / scale,
      y: (point.y - offset.y) / scale,
    }
  }
  public static compare(coords1: ICoords, coords2: ICoords) {
    return coords1.x === coords2.x && coords1.y === coords2.y
  }
  public static appendOffset(point: ICoords, offset: ICoords): ICoords {
    return { x: point.x + offset.x, y: point.y + offset.y }
  }
  public static truncateOffset(point: ICoords, offset: ICoords): ICoords {
    return { x: point.x - offset.x, y: point.y - offset.y }
  }

  public static isSnappedToGrid(point: ICoords, gridSize: number): boolean {
    return point.x % gridSize === 0 && point.y % gridSize === 0
  }
  public static snapToGrid(point: ICoords, gridSize: number): ICoords {
    return {
      x: Math.floor(point.x / gridSize) * gridSize,
      y: Math.floor(point.y / gridSize) * gridSize,
    }
  }
  public static offset(p1: ICoords, p2: ICoords): ICoords {
    return { x: -(p1.x - p2.x), y: -(p1.y - p2.y) }
  }
  public static startOfCenteredBound(bound: IRect): ICoords {
    return { x: bound.x - bound.width / 2, y: bound.y - bound.height / 2 }
  }
  public static normalize(point: ICoords) {
    const length = Math.sqrt(point.x * point.x + point.y * point.y)
    return { x: point.x / length, y: point.y / length }
  }
  public static perpendicular(point: ICoords) {
    return { x: -point.y, y: point.x }
  }
  public static vectorEndByLength(
    start: ICoords,
    angle: number,
    length: number
  ): ICoords {
    return {
      x: start.x + length * Math.cos(angle),
      y: start.y + length * Math.sin(angle),
    }
  }

  public static getAngleRelativeToXAxis(p1: ICoords, p2: ICoords) {
    return Math.atan2(p1.y - p2.y, p1.x - p2.x)
  }

  public static getAngleRelativeToYAxis(p1: ICoords, p2: ICoords) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x) - Math.PI / 2
  }

  public static normalizeShape(
    coordsList: ICoords[],
    { start, scale = 1, padding = Coords.zero() }: NormalizeSettings
  ) {
    return coordsList.map((coords) => {
      return {
        x: (coords.x - start.x) * scale + padding.x,
        y: (coords.y - start.y) * scale + padding.y,
      }
    })
  }

  public static rotate(
    point: ICoords,
    center: ICoords,
    angle: number
  ): ICoords {
    const x = point.x - center.x
    const y = point.y - center.y

    const rotatedX = x * Math.cos(angle) - y * Math.sin(angle)
    const rotatedY = x * Math.sin(angle) + y * Math.cos(angle)

    return {
      x: rotatedX + center.x,
      y: rotatedY + center.y,
    }
  }

  public static isZero(coords: ICoords) {
    return coords.x === 0 && coords.y === 0
  }

  public static scale(point: ICoords, scale: number): ICoords {
    return { x: point.x * scale, y: point.y * scale }
  }

  public static createFromSizesDiff(size1: ISize, size2: ISize) {
    return new Coords(size1.width - size2.width, size1.height - size2.height)
  }

  x
  y

  public constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  public scale(scale: number) {
    this.x *= scale
    this.y *= scale
    return this
  }

  public snapToGrid(gridSize: number) {
    this.x = Math.floor(this.x / gridSize) * gridSize
    this.y = Math.floor(this.y / gridSize) * gridSize
    return this
  }

  public addValue(value: number) {
    this.x += value
    this.y += value
    return this
  }
}
