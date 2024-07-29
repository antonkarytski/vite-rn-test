import { ICoords, IPaddings, ISize } from './types'
import { Coords } from './coords'

export class Size {
  public static readonly zero = (): ISize => {
    return { width: 0, height: 0 }
  }

  public static readonly isZero = (size: ISize | undefined | null) => {
    return !size || (size.width === 0 && size.height === 0)
  }
  public static readonly half = (size: ISize): ISize => {
    return {
      width: size.width / 2,
      height: size.height / 2,
    }
  }
  public static readonly grid = (
    rows: number,
    columns: number,
    gridSize: number
  ) => {
    return {
      width: columns * gridSize,
      height: rows * gridSize,
    }
  }
  public static equal(size1: ISize, size2: ISize): boolean {
    return size1.width === size2.width && size1.height === size2.height
  }

  public static isBigger(size: ISize, biggerThen: ISize) {
    return size.width > biggerThen.width || size.height > biggerThen.height
  }

  public static scale(source: ISize, multiplier: number) {
    return {
      width: source.width * multiplier,
      height: source.height * multiplier,
    }
  }

  public static scaleDown(
    originalSize: ISize,
    limitSize: ISize | undefined | null
  ) {
    if (
      !limitSize ||
      (originalSize.height <= limitSize.height &&
        originalSize.width <= limitSize.width)
    ) {
      return {
        height: originalSize.height,
        width: originalSize.width,
        scale: 1,
      }
    }
    const scale = Size.getMinRelativeScale(limitSize, originalSize)
    return {
      height: originalSize.height * scale,
      width: originalSize.width * scale,
      scale,
    }
  }

  public static toSquare(original: ISize) {
    const size = Math.max(original.height, original.width)
    return {
      width: size,
      height: size,
    }
  }

  public static max(size1: ISize, size2: ISize): ISize {
    return {
      width: Math.max(size1.width, size2.width),
      height: Math.max(size1.height, size2.height),
    }
  }

  public static maxForSome(sizes: ISize[]) {
    return sizes.reduce((max, size) => {
      return {
        width: Math.max(max.width, size.width),
        height: Math.max(max.height, size.height),
      }
    })
  }

  public static center(size: ISize): ICoords {
    return {
      x: size.width / 2,
      y: size.height / 2,
    }
  }

  public static getMinRelativeScale(numSize: ISize, denominatorSize: ISize) {
    return Math.min(
      numSize.height / denominatorSize.height,
      numSize.width / denominatorSize.width
    )
  }

  public static getMaxRelativeScale(numSize: ISize, denominatorSize: ISize) {
    return Math.max(
      numSize.height / denominatorSize.height,
      numSize.width / denominatorSize.width
    )
  }

  public static expand(size: ISize, expandTo: ICoords) {
    return {
      width: size.width + expandTo.x,
      height: size.height + expandTo.y,
    }
  }

  public static create(size: ISize) {
    return new Size(size.width, size.height)
  }

  public width: number
  public height: number

  public constructor(width: number, height: number) {
    this.width = width
    this.height = height
  }

  public merge(size: ISize) {
    this.width = Math.max(this.width, size.width)
    this.height = Math.max(this.height, size.height)
    return this
  }

  public diff(size: ISize) {
    return Coords.createFromSizesDiff(this, size)
  }

  public dividePaddings({
    top = 0,
    right = 0,
    left = 0,
    bottom = 0,
  }: Partial<IPaddings>) {
    this.width = this.width - left - right
    this.height = this.height - top - bottom
    return this
  }

  public getMax(size: ISize): ISize {
    return Size.max(this, size)
  }

  public getMinRelativeScale(toSize: ISize) {
    return Size.getMinRelativeScale(this, toSize)
  }
}
