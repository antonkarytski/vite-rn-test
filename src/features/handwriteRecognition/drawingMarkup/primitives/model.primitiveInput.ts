import { createEvent, restore, Store } from 'effector'

export class EffectorState<T> {
  public readonly setValue = createEvent<T>()
  public readonly $value: Store<T>

  public constructor(initialValue: T) {
    this.$value = restore(this.setValue, initialValue)
  }
}

export const primitiveInput = new EffectorState('')
