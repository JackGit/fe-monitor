import EventEmitter from 'eventemitter3'
import { inject, restore } from '../utils/function'

const xhrPrototype = XMLHttpRequest.prototype
const INJECTOR_PROPERTY = '__fm_xhr__'

// count of xhr request
let id = 0

export default class AjaxInjector extends EventEmitter {
  constructor () {
    super()
    this.tracker = []
    this.type = 'ajax'
  }

  install () {
    this.injectXhrOpen()
    this.injectXhrSend()
  }

  uninstall () {
    restore(this.tracker)
  }

  injectXhrOpen () {
    inject(xhrPrototype, 'open', function (method, url) {
      const xhr = this
      const injectorData = Object.create(null)

      // inject open arguments
      injectorData.id = id++
      injectorData.method = method
      injectorData.url = url

      xhr[INJECTOR_PROPERTY] = injectorData
    }, this.tracker)
  }

  injectXhrSend () {
    const injector = this
    const tracker = this.tracker
    let injected = false

    inject(xhrPrototype, 'send', function () {
      const xhr = this
      const data = xhr[INJECTOR_PROPERTY]

      data.sendAt = Date.now()

      // need to avoid repeat injection when repeat call send() method
      // it will coz duplicated emitted event
      if (!injected) {
        inject(xhr, 'onloadend', function () {
          data.status = xhr.status
          data.endAt = Date.now()
          injector.emit('complete', data)
        }, tracker)

        ;['ontimeout', 'onerror', 'onabort'].forEach(prop => {
          inject(xhr, prop, function () {
            data.status = xhr.status
            data.endAt = Date.now()
            injector.emit('error', data)
          }, tracker)
        })

        injected = true
      }
    }, tracker)
  }
}
