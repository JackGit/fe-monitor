import { toArray } from '../utils/lang'

export default class Tracer {
  constructor (options) {
    const defaultOptions = {
      reportUrl: '',
      debug: false,
      maxCache: 100
    }

    this.options = Object.assign({}, defaultOptions, options)
    this.traceCache = []
  }

  _generateRequest (data) {
    const request = {
      basic: null,
      traces: []
    }

    request.basic = {
      pageUrl: pageUrl(),
      fullPageUrl: fullPageUrl(),
      userAgent: userAgent(),
      resolution: resolution()
    }

    if (data) {
      request.traces.push(data)
    } else {
      request.traces = toArray(this.traceCache)
      this.traceCache = []
    }

    return request
  }

  _send (data) {
    const request = this._generateRequest(data)
    const url = this.options.reportUrl

    if (!url) {
      console.warn('Report URL is not set for Tracer!')
      return
    }

    if (this.options.debug) {
      post(
        url,
        request,
        response => console.log('Tracer.report() success', response),
        (statusText, status) => console.log('Tracer.report() failed', statusText, status)
      )
    } else {
      post(url, request)
    }
  }

  trace (data) {
    this.traceCache.push(data)
    // if reached to the cache max size, report at once
    if (this.traceCache.length === this.options.maxCache) {
      this.options.debug && console.log(`Reaching the max trace cache ${this.options.maxCache}, reporting now`)
      this.report()
    }
    return this
  }

  /**
   * send data to server
   * if no parameter passed to this method, it will send all cached traces, and clean the cache
   * if value passed to this method, it will only send it as a single trace, and trace cache won't be cleaned
   * @param  {Object} data
   */
  report (data) {
    console.log('report', data)
    this._send(data)
  }
}

// need to make sure this post is not watched by AjaxInjector
function post (url, data, onSuccess, onError) {
  const xhr = new XMLHttpRequest()
  xhr.onreadystatechange = function () {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
      onSuccess && onSuccess(xhr.responseText)
    } else {
      onError && onError(xhr.statusText || null, xhr.status)
    }
  }
  xhr.open('POST', url, true)
  xhr.send(data)
}

function resolution () {
  return [window.screen.width, window.screen.height]
}

function userAgent () {
  return navigator.userAgent
}

function fullPageUrl () {
  return window.location.href
}

function pageUrl () {
  return window.location.origin + window.location.pathname
}
