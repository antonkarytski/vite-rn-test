import { getScaleForSize } from './helpers'
import { attach, createEffect, createEvent, restore } from 'effector'
import { HandwritePrimitive } from '../../../core/api/primitives.types'
import {
  addPrimitivesList,
  getByOriginDrawingId,
} from '../../../core/api/primitives'
import { JIIXPrimitiveObject } from '../../myScript/types.jiix'
import { DrawingHistory } from '../drawingsList/types'
import { convertJIIXGlyphToPrimitive } from './myScriptConvert'

type ConvertGlyphsStoreProps = {
  glyphs: JIIXPrimitiveObject[]
  current: DrawingHistory | null
}

type TransferPrimitivesProps = {
  primitives: HandwritePrimitive[]
  history: DrawingHistory | null
}

export class CurrentDrawingModel {
  public readonly reset = createEvent()
  public readonly setItem = createEvent<DrawingHistory | null>()
  public readonly $item = restore(this.setItem, null)
  public readonly setMarkedPrimitives = createEvent<HandwritePrimitive[]>()
  public readonly addMarkedPrimitives = createEvent<
    HandwritePrimitive | HandwritePrimitive[]
  >()
  public readonly $markedPrimitives = restore(this.setMarkedPrimitives, []).on(
    this.addMarkedPrimitives,
    (state, payload) => {
      if (Array.isArray(payload)) return [...state, ...payload]
      return [...state, payload]
    }
  )

  public readonly setGlyphs = createEvent<JIIXPrimitiveObject[]>()
  public readonly $glyphs = restore(this.setGlyphs, []).reset(this.reset)

  public readonly removeConvertedGlyph = createEvent<HandwritePrimitive>()
  public readonly setConvertedGlyphs = createEvent<HandwritePrimitive[]>()
  public readonly $convertedGlyphs = restore(this.setConvertedGlyphs, [])
    .on(this.removeConvertedGlyph, (state, item) => {
      const index = state.findIndex((i) => i === item)
      if (index === -1) return state
      const newState = [...state]
      newState.splice(index, 1)
      return newState
    })
    .reset(this.reset)

  public readonly convertGlyphsToPrimitives = attach({
    source: { glyphs: this.$glyphs, current: this.$item },
    effect: async ({
      current,
      glyphs,
    }: ConvertGlyphsStoreProps): Promise<HandwritePrimitive[]> => {
      if (!current || (current && !glyphs.length)) {
        throw new Error('Cannot convert glyphs')
      }
      return glyphs.reduce<HandwritePrimitive[]>((acc, glyph) => {
        acc.push(...convertJIIXGlyphToPrimitive(glyph, { id: current.id }))
        return acc
      }, [])
    },
  })

  private readonly moveRecognizedToConverted = attach({
    source: this.$item,
    mapParams: (
      primitives: HandwritePrimitive[],
      history: DrawingHistory | null
    ) => ({ primitives, history }),
    effect: createEffect((props: TransferPrimitivesProps) => {
      if (
        !props.history ||
        props.history.id.toString() !== props.primitives[0]?.origin_drawing_id
      ) {
        return
      }
      this.setConvertedGlyphs([])
      this.addMarkedPrimitives(props.primitives)
    }),
  })

  public readonly sendAutoRecognizedGlyphs = attach({
    source: this.$convertedGlyphs,
    effect: (glyphs) => {
      addPrimitivesList(glyphs).then(() => {
        return this.moveRecognizedToConverted(glyphs)
      })
    },
  })

  public constructor() {
    this.$item.watch((item) => {
      this.reset()
      if (!item) return
      getByOriginDrawingId(item.id.toString()).then((e) => {
        this.setMarkedPrimitives(e)
      })
    })

    this.convertGlyphsToPrimitives.doneData.watch((glyphs) => {
      this.setConvertedGlyphs(glyphs)
    })
  }
}
export const currentDrawing = new CurrentDrawingModel()

type SelectedItemAttrs = {
  maxSize: number
  scale: { x: number; y: number }
}

export const selectedItemAttrsRef: SelectedItemAttrs = {
  scale: { x: 1, y: 1 },
  maxSize: 300,
}

currentDrawing.$item.watch((selected) => {
  const maxSize = selected
    ? Math.max(selected.size.width, selected.size.height)
    : 500
  selectedItemAttrsRef.maxSize = maxSize
  selectedItemAttrsRef.scale = getScaleForSize(300, maxSize)
})
