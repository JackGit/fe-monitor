import EventEmitter from 'eventemitter3'
import { isNative } from '../utils/lang'

const isFetchNative = isNative(window.fetch)

// count of fetch request
let id = 0

export default class FetchInterceptor extends EventEmitter {
  constructor () {
    super()
  }

  _wrapFetch () {
    const interceptor = this
    const nativeFetch = window.fetch

    window.fetch = function () {
      const msg = Object.create ? Object.create(null) : {}

      msg.id = id++
      msg.URL = arguments[0]
      msg.method = arguments[1] ? arguments[1].method : 'GET'

      interceptor.emit('send', msg)
      return nativeFetch.apply(window, arguments).then(r => {
        interceptor.emit('success', msg)
        interceptor.emit('complete', msg)
        return r
      }).catch(e => {
        interceptor.emit('error', msg)
        interceptor.emit('complete', msg)
        throw e
      })
    }
  }

  intercept () {
    if (!window.fetch) {
      console.warn('fetch is not supported in your browser, cannot do the fetch interception')
      return
    }

    if (!isNative(window.fetch)) {
      console.warn('fetch is not native in your browser. Make sure you are using a wrapper of native fetch or a xhr-based fetch polyfill. If you are using a polyfill, please use AjaxInterceptor instead')
    }

    this._wrapFetch()
  }
}
