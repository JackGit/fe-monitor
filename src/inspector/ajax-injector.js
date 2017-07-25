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
    const injector = this
    const tracker = this.tracker

    inject(xhrPrototype, 'open', function (method, url) {
      const xhr = this
      const injectorData = Object.create(null)

      // inject open arguments
      injectorData.id = id++
      injectorData.method = method
      injectorData.url = url

      // prevent below case would repeat triggering event emits
      // xhr.open()
      // xhr.send() // emit event once
      // xhr.open()
      // xhr.send() // emit event twice
      if (!xhr[INJECTOR_PROPERTY]) {
        inject(xhr, 'onloadend', function () {
          xhr[INJECTOR_PROPERTY].status = xhr.status
          xhr[INJECTOR_PROPERTY].endAt = Date.now()
          injector.emit('complete', xhr[INJECTOR_PROPERTY])
        }, tracker)

        ;['ontimeout', 'onerror', 'onabort'].forEach(prop => {
          inject(xhr, prop, function () {
            xhr[INJECTOR_PROPERTY].status = xhr.status
            xhr[INJECTOR_PROPERTY].endAt = Date.now()
            injector.emit('error', xhr[INJECTOR_PROPERTY])
          }, tracker)
        })
      }

      xhr[INJECTOR_PROPERTY] = injectorData
    }, tracker)
  }

  injectXhrSend () {
    const tracker = this.tracker

    inject(xhrPrototype, 'send', function () {
      this[INJECTOR_PROPERTY].sendAt = Date.now()
    }, tracker)
  }
}
