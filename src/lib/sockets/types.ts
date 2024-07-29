export type UnionFrom<T extends object> = T[keyof T]
export enum SocketAction {
  OPEN = 'open',
  CLOSE = 'close',
  MESSAGE = 'message',
  ERROR = 'error',
}

export type JoinActionsList<T extends Record<string, any>> = UnionFrom<{
  [K in keyof T]: T[K] & { type: K }
}>
