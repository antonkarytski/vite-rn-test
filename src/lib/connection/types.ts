export enum StructureItemType {
  MESSAGE = 1,
}

export type TypeStructureItem<T> = {
  type: StructureItemType
  key?: string
  value: T
}

type StructureCreatorProps = {
  message: <T>(key?: string) => TypeStructureItem<T>
}

export type TypeStructure<T extends Record<string, any>> = {
  [K in keyof T]: TypeStructureItem<T[K]>
}
export type StructureCreator<T extends Record<string, any>> = (
  props: StructureCreatorProps
) => { [K in keyof T]: TypeStructureItem<T[K]> }

export type ActionPair<A extends object> = { key: keyof A; payload: A[keyof A] }
