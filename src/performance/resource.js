import { hasPerformance } from '../utils/support'
const performance = window.performance

export function getTiming () {
  // safari has window.performance, but window.performance has not getEntries function
  if (hasPerformance() && performance.getEntriesByType) {
    return performance.getEntriesByType('resource')
      .map(entry => ({
        name: entry.name,
        size: entry.encodedBodySize,
        duration: entry.duration
      }))
  } else {
    return []
  }
}
