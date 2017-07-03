/**
 * ajax injection will inject:
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
 *  5. ontimeout
 *  6. onabort
 */

const isModernBrowser = !!XMLHttpRequest.prototype.addEventListener
const xhrOpen = XMLHttpRequest.prototype.open
const xhrSend = XMLHttpRequest.prototype.send
const INJECT_PROPERTY = '__inject_data__'

/**
 * inject xhr.open() method
 * @return {[type]} [description]
 */
function injectXhrOpen () {
  XMLHttpRequest.prototype.open = function () {
    const xhr = this
    const injectData = Object.create ? Object.create(null) : {}

    // inject open arguments
    injectData.method = arguments[0]
    injectData.URL = arguments[1]
    injectData.async = arguments[2]
    injectData.user = arguments[3]
    injectData.password = arguments[4]

    xhr[INJECT_PROPERTY] = injectData
    xhrOpen.apply(xhr, arguments)
  }
}

/**
 * inject xhr.send() method
 * @return {[type]} [description]
 */
export function injectXhrSend () {
  XMLHttpRequest.prototype.send = function () {
    const xhr = this
    const injectData = xhr[INJECT_PROPERTY]

    const originHandler = attach(xhr, 'readystatechange', function () {
      console.log('readystatechange', this.readyState)
    })

    xhr.onreadystatechange = function () {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 ) {
        // success
      } else {
        // error
      }
    }
    xhr.onloadend = function () {}
    xhr.ontimeout = function () {}
    xhr.onabort = function () {}
    xhr.onerror = function () {}

    try {
      // xhr.send() would throw error if xhr.state is not OPENED
      xhrSend.apply(xhr, arguments)
    } catch (e) {
      // dettach onreadystatechange handler if error happens
      _dettach(xhr, 'readystatechange', originHandler)
      // throw error to outside
      throw e
    }
  }
}

exports function injectReadyStateChange (xhr, callback) {

}

function injectTimeout (xhr, callback) {
  const xhrOnTimeout = xhr.ontimeout

  function timeoutHandler () {
    console.log('timeout injected')
    xhrOnTimeout && xhrOnTimeout.apply(xhr, arguments)
  }

  if (isModernBrowser) {
    xhr.addEventListener('timeout', timeoutHandler)
  } else {
    xhr.ontimeout = timeoutHandler
  }
}

function injectAbort () {

}

function injectError () {

}

function attach (xhr, event, handler) {
  const onevent = `on${event}`
  const originHandler = xhr[onevent]

  xhr[onevent] = function () {
    handler.apply(xhr, arguments)
    originHandler && originHandler.apply(xhr, arguments)
  }

  return originHandler
}

function dettach (xhr, event, originHandler) {
  xhr[`on${event}`] = originHandler
}

injectXhrOpen()
injectXhrSend()
