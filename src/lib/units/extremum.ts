import { ICoords, IRect, IExtremum, ISize } from './types'

import { Shape } from './shape'

export class Extremum {
  public static fromShape(shape: number[][]) {
    return shape.reduce((extremum, point) => {
      extremum.x0 = Math.min(point[0], extremum.x0)
      extremum.y0 = Math.min(point[1], extremum.y0)
      extremum.x1 = Math.max(point[0], extremum.x1)
      extremum.y1 = Math.max(point[1], extremum.y1)
      return extremum
    }, Extremum.start())
  }

  public static fromHistory(history: number[][][]) {
    if (!history.length) return null
    let fullExtremum = Extremum.initial
    history.forEach((shape) => {
      const extremum = Extremum.fromShape(shape)
      if (!extremum) return
      fullExtremum = Extremum.merge(extremum, fullExtremum)
    })
    if (fullExtremum === Extremum.initial) return null
    return new Extremum(Extremum.safeCheck(fullExtremum))
  }
  public static toRect(extremum: IExtremum, maxSize?: ISize) {
    const x = extremum.x0 === Infinity ? 0 : Math.max(extremum.x0, 0)
    const y = extremum.x1 === Infinity ? 0 : Math.max(extremum.y0, 0)
    const width = extremum.x1 - x
    const height = extremum.y1 - y
    return {
      x,
      y,
      width: maxSize ? Math.min(width, maxSize.width) : width,
      height: maxSize ? Math.min(height, maxSize.height) : height,
    }
  }

  public static fromRect(point: ICoords, size: ISize): IExtremum
  public static fromRect(rect: IRect): IExtremum
  public static fromRect(boundOrPoint: IRect | ICoords, optionalSize?: ISize) {
    const size = optionalSize ?? (boundOrPoint as IRect)
    return {
      x0: boundOrPoint.x,
      y0: boundOrPoint.y,
      x1: boundOrPoint.x + size.width,
      y1: boundOrPoint.y + size.height,
    }
  }

  public static fromCenter(point: ICoords, halfSize: ISize): IExtremum {
    return {
      x0: point.x - halfSize.width,
      y0: point.y - halfSize.height,
      x1: point.x + halfSize.width,
      y1: point.y + halfSize.height,
    }
  }

  public static fromPointsList(points: number[][]) {
    return points.reduce(
      (extremum, point) => {
        extremum.x0 = Math.min(point[0], extremum.x0)
        extremum.y0 = Math.min(point[1], extremum.y0)
        extremum.x1 = Math.max(point[0], extremum.x1)
        extremum.y1 = Math.max(point[1], extremum.y1)
        return extremum
      },
      {
        x0: Infinity,
        y0: Infinity,
        x1: 0,
        y1: 0,
      }
    )
  }

  public static fromShapes(shapes: number[][][]) {
    const result = shapes.reduce((acc, shape) => {
      return Extremum.merge(acc, Extremum.fromPointsList(shape))
    }, Extremum.start())
    return Extremum.safeCheck(result)
  }

  public static fromPoints(p1: ICoords, p2: ICoords): IExtremum {
    return {
      x0: Math.min(p1.x, p2.x),
      y0: Math.min(p1.y, p2.y),
      x1: Math.max(p1.x, p2.x),
      y1: Math.max(p1.y, p2.y),
    }
  }

  public static appendOffset(e: IExtremum, o: ICoords): IExtremum {
    return { x0: e.x0 + o.x, y0: e.y0 + o.y, x1: e.x1 + o.x, y1: e.y1 + o.y }
  }

  public static truncateOffset(e: IExtremum, o: ICoords): IExtremum {
    return { x0: e.x0 - o.x, y0: e.y0 - o.y, x1: e.x1 - o.x, y1: e.y1 - o.y }
  }

  public static expand(e: IExtremum, s: number, sY = s): IExtremum {
    return { x0: e.x0 - s, y0: e.y0 - sY, x1: e.x1 + s, y1: e.y1 + sY }
  }

  public static squeeze(e: IExtremum, s: number): IExtremum {
    return { x0: e.x0 + s, y0: e.y0 + s, x1: e.x1 - s, y1: e.y1 - s }
  }

  public static hitTest(e: IExtremum | null, p: ICoords): boolean {
    return !!e && p.x >= e.x0 && p.x <= e.x1 && p.y >= e.y0 && p.y <= e.y1
  }

  public static merge(e1: IExtremum, e2: IExtremum): IExtremum {
    return {
      x0: Math.min(e1.x0, e2.x0),
      x1: Math.max(e1.x1, e2.x1),
      y0: Math.min(e1.y0, e2.y0),
      y1: Math.max(e1.y1, e2.y1),
    }
  }

  public static leftOffset(e1: IExtremum, e2: IExtremum): ICoords {
    return { x: e2.x0 - e1.x0, y: e2.y0 - e1.y0 }
  }

  public static mergeSome(list: (IExtremum | null)[]) {
    return list.reduce<IExtremum>(
      (acc, e) => (e ? Extremum.merge(acc, e) : acc),
      Extremum.start()
    )
  }

  public static safeCheck(extremum: IExtremum) {
    const copy = { ...extremum }
    if (copy.x0 === Infinity)
      if (copy.x0 === Infinity) {
        copy.x0 = copy.x1
      }
    if (copy.y0 === Infinity) {
      copy.y0 = copy.y1
    }
    return copy
  }

  public static initial: IExtremum = {
    x0: Infinity,
    y0: Infinity,
    x1: 0,
    y1: 0,
  } as const

  public static start(): IExtremum {
    return { ...Extremum.initial }
  }

  public static area(extremum: IExtremum): number {
    return (extremum.x1 - extremum.x0) * (extremum.y1 - extremum.y0)
  }

  public static findIntersection(
    extremum1: IExtremum,
    extremum2: IExtremum
  ): IExtremum | null {
    const x0 = Math.max(extremum1.x0, extremum2.x0)
    const y0 = Math.max(extremum1.y0, extremum2.y0)
    const x1 = Math.min(extremum1.x1, extremum2.x1)
    const y1 = Math.min(extremum1.y1, extremum2.y1)

    if (x0 <= x1 && y0 <= y1) {
      return { x0, y0, x1, y1 }
    }

    return null
  }

  public static square(extremum: IExtremum) {
    return (extremum.x1 - extremum.x0) * (extremum.y1 - extremum.y0)
  }

  public x0
  public y0
  public x1
  public y1

  public constructor({ x0, y0, y1, x1 }: IExtremum) {
    this.x0 = x0
    this.y0 = y0
    this.x1 = x1
    this.y1 = y1
  }

  public intersectionWith(extremum: IExtremum): Extremum | null {
    const result = Extremum.findIntersection(this, extremum)
    if (!result) return null
    return new Extremum(result)
  }

  public diff(extremum: IExtremum): IExtremum[] {
    const intersection = Extremum.findIntersection(this, extremum)

    if (!intersection) return [this]

    const differences: IExtremum[] = []
    if (this.y0 < intersection.y0) {
      differences.push({
        x0: this.x0,
        y0: this.y0,
        x1: this.x1,
        y1: intersection.y0,
      })
    }

    if (this.y1 > intersection.y1) {
      differences.push({
        x0: this.x0,
        y0: intersection.y1,
        x1: this.x1,
        y1: this.y1,
      })
    }

    if (this.x0 < intersection.x0) {
      differences.push({
        x0: this.x0,
        y0: intersection.y0,
        x1: intersection.x0,
        y1: intersection.y1,
      })
    }

    if (this.x1 > intersection.x1) {
      differences.push({
        x0: intersection.x1,
        y0: intersection.y0,
        x1: this.x1,
        y1: intersection.y1,
      })
    }

    return differences
  }

  public mergeWith(extremum: IExtremum): Extremum {
    return new Extremum(Extremum.merge(this, extremum))
  }

  public toObject(): IExtremum {
    return { x0: this.x0, y0: this.y0, x1: this.x1, y1: this.y1 }
  }

  public update = ({ x0, y0, x1, y1 }: IExtremum) => {
    this.x0 = x0
    this.y0 = y0
    this.x1 = x1
    this.y1 = y1
    return this
  }

  public expand = (value: number, valueY = value) =>
    new Extremum(Extremum.expand(this, value, valueY))

  public hitTest = (point: ICoords) => Extremum.hitTest(this, point)
  public getRect() {
    return Extremum.toRect(this)
  }

  public getSize(): ISize {
    return {
      width: this.x1 - this.x0,
      height: this.y1 - this.y0,
    }
  }

  public center() {
    return {
      x: (this.x0 + this.x1) / 2,
      y: (this.y0 + this.y1) / 2,
    }
  }

  public square() {
    return (this.x1 - this.x0) * (this.y1 - this.y0)
  }
}
