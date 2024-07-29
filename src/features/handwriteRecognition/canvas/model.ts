import Konva from 'konva'
import { Selection } from './selection'
import { KonvaEventObject } from 'konva/lib/Node'
import { createEvent, Store } from 'effector'
import { ICoords } from '../../../lib/units/types'
import { Polygon, System } from 'detect-collisions'
import { debounce } from 'patronum'
import { DrawingHistory } from '../drawingsList/types'

type CanvasModelProps = {
  $drawing: Store<DrawingHistory | null>
}

type SavedShape = {
  id: number
  points: number[][]
}

export class CanvasModel {
  private _layer: Konva.Layer | null = null
  private _stage: Konva.Stage | null = null
  private readonly selection = new Selection()
  private readonly collisions = new System()
  private collisionShapeMap = new Map<Polygon, SavedShape>()

  private readonly intersectionDetected = createEvent<number[]>()
  public readonly primitiveSelected = debounce({
    source: this.intersectionDetected,
    timeout: 50,
  })

  public constructor({ $drawing }: CanvasModelProps) {
    $drawing.watch((drawing) => {
      this.recalculateCollisionsSystem(drawing)
    })
  }

  private recalculateCollisionsSystem(drawing: DrawingHistory | null) {
    this.collisions.clear()
    this.collisionShapeMap.clear()
    if (!drawing) return
    drawing.shapes.forEach((shape, index) => {
      setTimeout(() => {
        if (!this._stage) return

        const offset = this._stage.offset()
        const scale = this._stage.scale() || { x: 1, y: 1 }
        const polygon = this.collisions.createPolygon(
          { x: 0, y: 0 },
          shape.map(([x, y]) => ({
            x: (x - offset.x) * scale.x,
            y: (y - offset.y) * scale.y,
          }))
          //{ isStatic: true }
        )

        this.collisionShapeMap.set(polygon, {
          id: index,
          points: shape,
        })
      }, 100)
    })
  }

  public calculateAllCollisions() {
    const collisions: Set<Polygon>[] = []
    this.collisionShapeMap.forEach((e, polygon) => {
      this.collisions.checkOne(polygon, (e) => {
        const existingCollision = collisions.find((collision) => {
          return collision.has(e.a) || collision.has(e.b)
        })
        if (existingCollision) {
          existingCollision.add(e.a)
          existingCollision.add(e.b)
          return
        }
        const newSet = new Set<Polygon>()
        newSet.add(e.a)
        newSet.add(e.b)
        collisions.push(newSet)
      })
    })
  }

  public readonly initLayer = (layer: Konva.Layer | null) => {
    if (this._layer === layer) return
    this._layer = layer
    if (layer) {
      setTimeout(() => {
        layer.add(this.selection.rect)
      }, 100)
    }
  }

  public readonly initStage = (stage: Konva.Stage | null) => {
    if (this._stage === stage) return
    this._stage = stage
  }

  private toRelativeCoords(point: ICoords) {
    if (!this._stage) throw new Error('Stage is not initialized')
    return {
      x: point.x / this._stage.scaleX() + this._stage.offset().x,
      y: point.y / this._stage.scaleY() + this._stage.offset().y,
    }
  }

  public readonly onActionDown = (e: KonvaEventObject<MouseEvent>) => {
    if (!this._stage) return
    e.evt.preventDefault()
    const point = this._stage.getPointerPosition()
    if (!point) return
    this.selection.start(this.toRelativeCoords(point))
  }

  public readonly onActionMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!this.selection.isVisible || !this._stage) return
    e.evt.preventDefault()
    const point = this._stage.getPointerPosition()
    if (!point) return
    this.selection.move(this.toRelativeCoords(point))
  }

  public readonly onActionEnd = (e: KonvaEventObject<MouseEvent>) => {
    if (!this.selection.isVisible || !this._stage) return
    e.evt.preventDefault()
    this.selection.end()

    const rect = this.selection.rect.getClientRect()
    const collisionRect = this.collisions.createBox(
      rect,
      rect.width,
      rect.height
    )
    this.collisions.update()
    const selection: number[] = []
    this.collisions.checkOne(collisionRect, (e) => {
      if (e.aInB) return
      const shape = this.collisionShapeMap.get(e.b)
      if (!shape) return
      selection.push(shape.id)
      this.intersectionDetected(selection)
    })
    this.collisions.remove(collisionRect)
    if (selection.length === 0) this.intersectionDetected([])

    // const selected = this._stage.find('.line').filter((shape) => {
    //   return Konva.Util.haveIntersection(rect, shape.getClientRect())
    // })
    // this.primitiveSelected(selected.map((shape) => +shape.attrs.id))
  }
}
