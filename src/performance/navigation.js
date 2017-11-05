import { addEventListener } from '../utils/build-in'
import { hasPerformance } from '../utils/support'

const VERY_BEGINNING = window.__fm_verybeginning__ || Date.now()
const chromeLoadTimes = window.chrome && window.chrome.loadTimes
const hasPerformanceTiming = hasPerformance()
const performanceTiming = hasPerformanceTiming ? window.performance.timing : Object.create(null)

const TIMES = {
  DNS: ['domainLookupStart', 'domainLookupEnd'],
  TCP: ['connectStart', 'connectEnd'],
  request: ['requestStart', 'responseStart'],
  response: ['responseStart', 'responseEnd'],
  domContentLoadedEvent: ['domContentLoadedEventStart', 'domContentLoadedEventEnd'],
  loadEvent: ['loadEventStart', 'loadEventEnd'],

  whiteScreen: ['fetchStart', 'firstPaint'],  // firstPaint is not performance.timing property
  firstScreen: ['firstPaint', 'loadEventEnd'],
  pageLoad: ['fetchStart', 'loadEventEnd'],
  total: ['navigationStart', 'loadEventEnd']
}

export function getTiming () {
  const navigationTiming = []
  Object.keys(TIMES).forEach(prop => {
    const start = performanceTiming[TIMES[prop][0]]
    const end = performanceTiming[TIMES[prop][1]]
    const t = end - start
    navigationTiming.push({
      name: prop,
      duration: t > 0 ? t : 0,
      start,
      end
    })
  })
  return navigationTiming
}

polyfill()

function polyfill () {
  if (hasPerformanceTiming) {
    addEventListener('DOMContentLoaded', _ => {
      performanceTiming.firstPaint = firstPaint() || Date.now()
    })
  } else {
    addEventListener('DOMContentLoaded', _ => {
      const onDOMContentLoaded = Date.now()
      // treat these timing points as when DOMContentLoaded triggered
      ;['domContentLoadedEventStart', 'domContentLoadedEventEnd', 'loadEventStart', 'firstPaint'].forEach(prop =>
        performanceTiming[prop] = onDOMContentLoaded
      )
    })
    addEventListener('load', _ => {
      performanceTiming.loadEventEnd = Date.now()
    })

    // these fields can't be polyfilled
    ;['DNS', 'TCP', 'request', 'response'].forEach(key =>
      TIMES[key].forEach(prop => performanceTiming[prop] = 0)
    )

    // these timing points can only be mimic as the very beginning point
    ;['fetchStart', 'navigationStart'].forEach(prop => performanceTiming[prop] = VERY_BEGINNING)
  }
}

function firstPaint () {
  if (chromeLoadTimes) {
    const times = chromeLoadTimes()
    return times.firstPaintTime * 1000
  } else if (performanceTiming && performanceTiming.msFirstPaint) {
    return performanceTiming.msFirstPaint
  } else {
    return 0
  }
}
