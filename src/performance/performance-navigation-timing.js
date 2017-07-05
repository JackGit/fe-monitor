const performance = window.performance
const chrome = window.chrome
const chromeLoadTimes = chrome ? chrome.loadTimes : null

const MAPPING = {
  unload: ['unloadEventStart', 'unloadEventEnd'],
  redirect: ['redirectStart', 'redirectEnd'],
  DNS: ['domainLookupStart', 'domainLookupEnd'],
  TCP: ['connectStart', 'connectEnd'],
  request: ['requestStart', 'responseStart'],
  response: ['responseStart', 'responseEnd'],
  domContentLoaded: ['domContentLoadedEventStart', 'domContentLoadedEventEnd'],
  load: ['loadEventStart', 'loadEventEnd'],

  domReady: ['domInteractive', 'domComplete'],
  whiteScreen: ['navigationStart', 'responseStart'],
  firstScreen: null,
  total: ['navigationStart', 'loadEventEnd']
}


/**
 * unload time: unloadEventEnd - unloadEventStart (if there is unload event)
 * dom loading time: domComplete - domLoading
 * network latency (DNS, TCP, HTTP): responseEnd - fetchStart
 * DNS: domainLookUpEnd - domainLookupStart
 * TCP: connectEnd - connectStart
 * HTTP: responseStart - requestStart
 * page loading time: loadEventEnd - navigationStart
 * white screen time: <firstPaint> - navigationStart
 * first screen time: <firstScreen> - <firstPaint>
 */

// press enter after url -> start point
// unload, dns, tcp, http, request, response
// first paint -> till now, is the white screen time
// DOMContentLoaded
// first screen paint completed -> till now, is the first screen time
// page loaded

/* equivalent */
domLoading => document.readyState === 'loading'
domInteractive => document.readyState === 'interactive'
domComplete => document.readyState === 'complete'

domContentLoadedEventStart => ?
domContentLoadedEventEnd => onContentLoaded handler

// <firstPaint>
window.chrome.loadTimes().firstPaintTime // chrome
performance.timing.msFirstPaint // ms


navigationStart, fetchStart, responseEnd => <header> script
loadEventEnd => onload

export function firstPaint () {
  if (chromeLoadTimes) {
    const times = chromeLoadTimes()
    return times.firstPaintTime - times.startLoadTime
  } else if (performance && performance.timing.msFirstPaint) {
    const timing = performance.timing
    return timing.navigationStart === 0 ? -1 : timing.msFirstPaint - timing.navigationStart
  } else {
    return -1
  }
}
