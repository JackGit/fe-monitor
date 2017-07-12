import { inject, restore } from '../utils/function'
import { processException } from './processor'

const tracker = []

export default {
  install,
  uninstall
}

function install (options) {
  const opt = Object.assign({}, {
    normal: true,
    promise: true
  }, options)

  opt.normal && installNormalUncaughtErrorHandler()
  opt.promise && installPromiseUncaughtErrorHandler()
}

function uninstall () {
  restore(tracker)
}

/**
 * use window onerror handler, as same as error even listener, to global catch uncaught errors
 * it's able to catch:
 *   1. syntax error
 *   2. runtime error: any uncaught sync errors
 *   3. runtime error: any async error (not error in promise)
 *
 * it's not able to catch:
 *   1. error in promise chain (then / catch)
 *   2. static resource loading error (it can be caught by capture phase of error event, but I'm intentially ignore this error)
 *   3. dynamic resource loading error
 */
function installNormalUncaughtErrorHandler () {
  inject(window, 'onerror', function (msg, url, lineNo, columnNo, error) {
    if (!error) {
      error = new Error(msg)
      error.stack = [{
        args: [],
        column: columnNo,
        line: lineNo,
        url,
        func: '?'
      }]
    }
    processException(error)

    // cannot throw error outside, coz it will stop original onerror execution if there is one
  }, tracker)
}

/**
 * Error in promise can't be caught outside, event in window.onerror, it can only be caught by promise.catch
 *
 * For example:
 * new Promise((resolve, reject) => {
 *   resolve()
 * }).then(_ => {
 *   throw new Error('you cannot catch it outside of promise')
 * }).catch(e => {
 *   // above error can only by caught here
 *   throw new Error('you cannot catch it outside of promise')
 * })
 */
function installPromiseUncaughtErrorHandler () {
  // some browser support unhandledrejection event, which is able to catch uncaught promise error
  inject(window, 'onunhandledrejection', function (event) {
    // if onunhandledrejection is browser native support, event would be instance of PromiseRejectionEvent, reason path is event.reason
    // if onunhandledrejection is third party, like bluebird implementation, event would be CustomerEvent, reason path is event.detail.reason
    // reason is { message, stack }
    const reason = event.reason ? event.reason : event.detail.reason
    const error = new Error(reason.message)
    error.name = 'PromiseError'
    error.stack = reason.stack
    processException(error)

    // cannot throw error outside, coz it will stop original onunhandledrejection execution if there is one
  }, tracker)
}
