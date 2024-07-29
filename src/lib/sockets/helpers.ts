import { createEvent, Event as EffectorEvent } from 'effector'
import { TypeStructure } from '../connection/types'

export const defaultActionCreator = (
  action: string | number | symbol,
  payload: any
) => ({
  action,
  ...payload,
})
export const typeKeyRetriever = (data: any) => data.type
export const straightDataRetriever = (data: any) => data

export function createMessageList<Messages extends object>(
  messages: TypeStructure<Messages>
) {
  const list = {} as { [K in keyof Messages]: EffectorEvent<Messages[K]> }
  const map = {} as Record<string, keyof Messages>
  for (let key in messages) {
    list[key] = createEvent()
    map[messages[key].key || key] = key
  }
  return { list, map }
}

export const typeActionCreator = (
  type: string | number | symbol,
  payload: any
) => ({
  type,
  ...payload,
})
