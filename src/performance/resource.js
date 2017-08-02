import { hasPerformance } from '../utils/support'
const performance = window.performance

export function getTiming () {
  // safari has window.performance, but window.performance has not getEntries function
  if (hasPerformance() && performance.getEntries) {
    return performance.getEntries()
      .filter(entry => entry.entryType === 'resource')
      .map(entry => ({
        name: entry.name,
        size: entry.encodedBodySize,
        duration: entry.duration
      }))
  } else {
    return []
  }
}
