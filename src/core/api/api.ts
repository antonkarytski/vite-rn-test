import { ApiManager, ServerManager } from '@heyheyjude/toolkit'

const server = new ServerManager({
  initialRoot: 'http://localhost:3000',
  apiGenerator: (root) => root,
})
export const api = new ApiManager({ server }).debug()
