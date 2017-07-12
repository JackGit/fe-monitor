import EventEmitter from 'eventemitter3'
import { isNative } from '../utils/lang'
import { replace, restore } from '../utils/function'

const isFetchNative = isNative(window.fetch)

// count of fetch request
let id = 0

export default class FetchInjector extends EventEmitter {
  constructor () {
    super()
    this.tracker = []
    this.type = 'fetch'
  }

  _injectFetch () {
    const injector = this
    const tracker = this.tracker

    replace(window, 'fetch', function (origFetch) {
      return function () {
        const data = Object.create(null)

        data.id = id++
        data.url = arguments[0]
        data.method = arguments[1] ? arguments[1].method : 'GET'
        data.sendAt = Date.now()

        return origFetch.apply(this, arguments).then(r => {
          data.endAt = Date.now()
          data.status = r.status
          injector.emit('complete', data)
          return r
        }).catch(e => {
          data.endAt = Date.now()
          data.status = ''
          injector.emit('error', data)
          throw e
        })
      }
    }, tracker)
  }

  install () {
    if (!window.fetch) {
      console.warn('fetch is not supported in your browser, cannot do the fetch injection')
      return
    }

    if (!isNative(window.fetch)) {
      console.warn('fetch is not native in your browser. Make sure you are using a wrapper of native fetch or a xhr-based fetch polyfill. If you are using a polyfill, please use AjaxInjector instead')
    }

    this._injectFetch()
  }

  uninstall () {
    restore(this.tracker)
  }
}
