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
import { wrapFunc } from '../utils/wrap'

const xhrPrototype = XMLHttpRequest.prototype
const INTERCEPT_PROPERTY = '__fm_xhr'

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
    wrapFunc(xhrPrototype, 'open', function (method, url) {
      const xhr = this
      const interceptData = Object.create(null)

      // intercept open arguments
      interceptData.id = id++
      interceptData.method = method
      interceptData.url = url

      xhr[INTERCEPT_PROPERTY] = interceptData
    })
  }

  interceptXhrSend () {
    const interceptor = this

    wrapFunc(xhrPrototype, 'send', function () {
      const xhr = this
      const msg = xhr[INTERCEPT_PROPERTY]

      wrapFunc(xhr, 'onreadystatechange', function () {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
          interceptor.emit('success', msg)
        } else {
          interceptor.emit('error', msg)
        }
      })

      wrapFunc(xhr, 'onloadend', function () {
        interceptor.emit('complete', msg)
      })

      ['ontimeout', 'onerror', 'onabort'].forEach(prop => {
        wrapFunc(xhr, prop, function () {
          interceptor.emit('error', msg)
        })
      })
    })
  }
}
