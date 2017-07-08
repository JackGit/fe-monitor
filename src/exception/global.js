import { wrapFunc } from '../utils/wrap'

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
export function installNormalUncaughtErrorHandler (replacementTracker) {
  wrapFunc(window, 'onerror', function (/* msg, url, lineNo, columnNo, error */) {
    processError()
  }, null, replacementTracker)
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
export function installPromiseUncaughtErrorHandler (replacementTracker) {
  // some browser support unhandledrejection event, which is able to catch uncaught promise error
  if (window.onunhandledrejection) {
    wrapFunc(window, 'onunhandledrejection', function (event) {
      // if onunhandledrejection is browser native support, event would be instance of PromiseRejectionEvent, reason path is event.reason
      // if onunhandledrejection is third party, like bluebird implementation, event would be CustomerEvent, reason path is event.detail.reason
      // reason is { message, stack }
      processError({
        reason: event.reason ? event.reason : event.detail.reason,
        type: event.type
      })
    }, null, replacementTracker)
  }
}
