/**
 * ajax interceptor will intercept:
 *  1. xhr.open()
 *  2. xhr.send()
 *  3. xhr.onreadystatechange
 *  4. xhr.ontimeout
 *  5. xhr.onabort
 *  6. xhr.onerror
 *  7. xhr.onloadend
 *
 * dispatch events:
 *  1. onsend
 *  2. onerror
 *  3. oncomplete
 *  4. onsuccess
 */
import EventEmitter from 'eventemitter3'
const xhrOpen = XMLHttpRequest.prototype.open
const xhrSend = XMLHttpRequest.prototype.send
const INTERCEPT_PROPERTY = '__intercept_data__'

// count of xhr request
let id = 0

export default class AjaxInterceptor extends EventEmitter {
  constructor () {
    super()
  }

  intercept () {
    this.interceptXhrOpen()
    this.interceptXhrSend()
  }

  interceptXhrOpen () {
    XMLHttpRequest.prototype.open = function () {
      const xhr = this
      const interceptData = Object.create ? Object.create(null) : {}

      // intercept open arguments
      interceptData.id = id++
      interceptData.method = arguments[0]
      interceptData.URL = arguments[1]

      xhr[INTERCEPT_PROPERTY] = interceptData
      xhrOpen.apply(xhr, arguments)
    }
  }

  interceptXhrSend () {
    const interceptor = this

    XMLHttpRequest.prototype.send = function () {
      const xhr = this
      const msg = xhr[INTERCEPT_PROPERTY]
      const xhrOnReadyStateChange = xhr.onreadystatechange
      const xhrOnError = xhr.onerror
      const xhrOnTimeout = xhr.ontimeout
      const xhrOnAbort = xhr.onabort
      const xhrOnLoadEnd = xhr.onloadend

      interceptor.emit('send', msg)

      xhr.onreadystatechange = function () {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
          interceptor.emit('success', msg)
        } else {
          interceptor.emit('error', msg)
        }
        xhrOnReadyStateChange && xhrOnReadyStateChange.apply(xhr, arguments)
      }

      xhr.onloadend = function () {
        interceptor.emit('complete', msg)
        xhrOnLoadEnd && xhrOnLoadEnd.apply(xhr, arguments)
      }

      xhr.ontimeout = function () {
        interceptor.emit('error', msg)
        xhrOnTimeout && xhrOnTimeout.apply(xhr, arguments)
      }

      xhr.onabort = function () {
        interceptor.emit('error', msg)
        xhrOnAbort && xhrOnAbort.apply(xhr, arguments)
      }

      xhr.onerror = function () {
        interceptor.emit('error', msg)
        xhrOnError && xhrOnError.apply(xhr, arguments)
      }

      xhrSend.apply(xhr, arguments)
    }
  }
}
