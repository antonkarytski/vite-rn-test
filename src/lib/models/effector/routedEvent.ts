import { createEvent } from 'effector'
import { ActionPair } from '../../connection/types'

export const createRoutedEvent = <List extends object>() => {
  const event = createEvent<ActionPair<List>>()
  return Object.assign(
    <K extends keyof List>(key: K, payload: List[K]) => {
      event({ key, payload })
    },
    { event }
  )
}
