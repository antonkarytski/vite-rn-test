import { createEffect, createEvent, createStore } from 'effector'
import { persist } from 'effector-storage/local'
import { LocalStorageKey } from '../../../core/api/localstorage'
import { DrawingHistory } from './types'

export type Db = {
  histories: DrawingHistory[]
}

const PAGES_COUNT = 417
export const ITEMS_PER_PAGE = 100

export class ImagesListModel {
  public readonly setPage = createEvent<
    number | ((current: number) => number)
  >()
  public readonly $page = createStore(0).on(this.setPage, (state, payload) => {
    return typeof payload === 'number' ? payload : payload(state)
  })

  public nextPage() {
    this.setPage((page) => Math.min(page + 1, PAGES_COUNT))
  }
  public prevPage() {
    this.setPage((page) => Math.max(page - 1, 0))
  }

  private readonly fetchPage = createEffect(
    (page: number): Promise<DrawingHistory[]> => {
      return fetch(`../../assets/db-${page}.json`)
        .then((e) => e.json())
        .then((e) => {
          return e.histories.map((history) => {
            return {
              ...history,
              shapes: history.shapes.map((shape) => shape.points),
            }
          })
        })
    }
  )
  public readonly $db = createStore<Db>({ histories: [] }).on(
    this.fetchPage.doneData,
    (_, histories) => ({ histories })
  )

  public constructor() {
    this.$page.watch((page) => this.fetchPage(page))
    persist({
      store: this.$page,
      key: LocalStorageKey.DRAWING_LIST_CURRENT_PAGE,
    })
  }
}

export const drawingsListModel = new ImagesListModel()
