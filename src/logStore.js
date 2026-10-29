// Captures console output, uncaught errors and unhandled promise rejections
// so they can be shown on the page (handy on phones, where dev tools aren't available).
// Imported first in main.jsx so it records from page load onward.

const LEVELS = ['log', 'info', 'warn', 'error', 'debug']
const MAX_ENTRIES = 500

let entries = []
const listeners = new Set()

const emit = () => listeners.forEach((listener) => listener())

const stringify = (value) => {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch {
      return '[unserializable]'
    }
  }
  return String(value)
}

const isErrorLike = (value) =>
  value instanceof Error ||
  (typeof DOMException !== 'undefined' && value instanceof DOMException)

// for...in also picks up inherited enumerable properties, which is where
// browser objects (e.g. Apple Pay events) keep their fields.
const readProperties = (obj) => {
  const props = []
  for (const key in obj) {
    let value
    try {
      value = obj[key]
    } catch {
      continue
    }
    if (typeof value === 'function') continue
    props.push([key, stringify(value)])
  }
  return props
}

const describeArg = (arg) => {
  if (isErrorLike(arg)) {
    return {
      kind: 'error',
      type: arg.constructor?.name || 'Error',
      name: arg.name,
      message: arg.message,
      stack: arg.stack,
    }
  }
  if (arg === null) return { kind: 'value', value: 'null' }
  if (arg === undefined) return { kind: 'value', value: 'undefined' }
  if (typeof arg === 'object') {
    return {
      kind: 'object',
      heading: Array.isArray(arg) ? `Array(${arg.length})` : arg.constructor?.name || 'Object',
      entries: readProperties(arg),
    }
  }
  return { kind: 'value', value: String(arg) }
}

const addEntry = (level, args) => {
  entries = [
    ...entries.slice(-(MAX_ENTRIES - 1)),
    {
      id: `${Date.now()}-${Math.random()}`,
      level,
      timestamp: new Date().toLocaleTimeString(),
      args: args.map(describeArg),
    },
  ]
  emit()
}

LEVELS.forEach((level) => {
  const original = console[level].bind(console)
  console[level] = (...args) => {
    original(...args)
    addEntry(level, args)
  }
})

window.addEventListener('error', (event) => {
  const where = event.filename ? ` (${event.filename}:${event.lineno}:${event.colno})` : ''
  addEntry('error', [`[Uncaught]${where}`, event.error ?? event.message])
})

window.addEventListener('unhandledrejection', (event) => {
  addEntry('error', ['[Unhandled rejection]', event.reason])
})

export const logStore = {
  subscribe(listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  getSnapshot: () => entries,
  clear() {
    entries = []
    emit()
  },
}
