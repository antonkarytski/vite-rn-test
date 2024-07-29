import { StructureItemType, TypeStructureItem } from './types'

export const Typer = {
  create: <T>() => null as T,
  array: <T>() => [] as T[],
  item: <T>(key?: string): TypeStructureItem<T> => ({
    key,
    value: null as T,
    type: StructureItemType.MESSAGE,
  }),
}
