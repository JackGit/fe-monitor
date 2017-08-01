import Tracer from '../tracer'
import AjaxInjector from './ajax-injector'
import FetchInjector from './fetch-injector'
import config from '../config'

let installed = false
let ajaxInjector = null
let fetchInjector = null

export default {
  install,
  uninstall
}

function install (options) {
  if (installed) {
    console.warn('FM.Inspector.HTTP has installed already')
    return
  }

  if (config().enableAjaxInspector) {
    ajaxInjector = new AjaxInjector()
    ajaxInjector.install()
    addEventListener(ajaxInjector)
  }

  if (config().enableFetchInspector) {
    fetchInjector = new FetchInjector()
    fetchInjector.install()
    addEventListener(fetchInjector)
  }

  installed = true
}

function uninstall () {
  if (ajaxInjector) {
    ajaxInjector.uninstall()
    removeEventListener(ajaxInjector)
  }
  if (fetchInjector) {
    fetchInjector.uninstall()
    removeEventListener(fetchInjector)
  }

  installed = false
}

function addEventListener (injector) {
  injector.on('complete', data => {
    Tracer.report({
      type: injector.type,
      url: data.url,
      method: data.method,
      startTiming: data.sendAt,
      endTiming: data.endAt,
      duration: data.endAt - data.sendAt,
      status: data.status,
      ok: true
    })
  })
  injector.on('error', data => {
    Tracer.report({
      type: injector.type,
      url: data.url,
      method: data.method,
      startTiming: data.sendAt,
      endTiming: data.endAt,
      duration: data.endAt - data.sendAt,
      status: data.status,
      ok: false
    })
  })
}

function removeEventListener (injector) {
  injector.removeListener('complete')
  injector.removeListener('error')
}
