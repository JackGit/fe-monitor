import { hasPerformance } from '../utils/support'
const performance = window.performance

export function getTiming () {
  if (hasPerformance()) {
    return performance.getEntries()
      .filter(entry => entry.entryType === 'resource')
      .map(entry => ({
        name: entry.name,
        size: entry.encodedBodySize,
        duration: entry.duration,
        start: entry.fetchStart,
        end: entry.responseEnd
      }))
  } else {
    return []
  }
}
