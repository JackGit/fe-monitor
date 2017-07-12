import { addEventListener } from '../utils/event'

const VERY_BEGINNING = window.__fm_verybeginning__ || Date.now()
const chromeLoadTimes = window.chrome && window.chrome.loadTimes
const hasPerformanceTiming = window.performance && window.performance.timing
const performanceTiming = hasPerformanceTiming ? window.performance.timing : Object.create(null)
const navigationTiming = Object.create(null)

export default navigationTiming

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

Object.keys(TIMES).forEach(prop => {
  Object.defineProperty(navigationTiming, prop, {
    get () {
      const t = performanceTiming[TIMES[prop][1]] - performanceTiming[TIMES[prop][0]]
      return t > 0 ? t : 0
    }
  })
})

polyfill()

function polyfill () {
  if (hasPerformanceTiming) {
    addEventListener(window, 'DOMContentLoaded', _ => {
      performanceTiming.firstPaint = firstPaint() || Date.now()
    })
  } else {
    addEventListener(window, 'DOMContentLoaded', _ => {
      const onDOMContentLoaded = Date.now()
      // treat these timing points as when DOMContentLoaded triggered
      ;['domContentLoadedEventStart', 'domContentLoadedEventEnd', 'loadEventStart', 'firstPaint'].forEach(prop =>
        performanceTiming[prop] = onDOMContentLoaded
      )
    })
    addEventListener(window, 'load', _ => {
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
    return times.firstPaintTime
  } else if (performanceTiming && performanceTiming.msFirstPaint) {
    return performanceTiming.msFirstPaint
  } else {
    return 0
  }
}
