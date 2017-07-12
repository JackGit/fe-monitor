const performance = window.performance

export function getResourceTiming () {
  return performance.getEntries()
    .filter(entry => entry.entryType === 'resource')
    .map(entry => ({
      name: entry.name,
      size: entry.encodedBodySize,
      duration: entry.duration
    }))
}
