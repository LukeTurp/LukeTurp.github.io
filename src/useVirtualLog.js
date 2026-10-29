import { useSyncExternalStore } from 'react'
import { logStore } from './logStore.js'

export default function useVirtualLog() {
  const entries = useSyncExternalStore(logStore.subscribe, logStore.getSnapshot)
  return [entries, logStore.clear]
}
