/**
 * try-catch wrapper is trying to mannually handle error in try-catch block, instead of handle error in window.onload function
 * error object in window.onload function may miss stack information in some browers
 */
import TraceKit from 'tracekit'
import { replace, restore, copy } from '../utils/function'
import { isFunction, toArray } from '../utils/lang'

const tracker = []

export function install (options) {
  const opt = Object.assign({}, {
    timerFunction: true,
    rafFunction: true,
    eventListener: true
  }, options)

  opt.timerFunction && tryCatchTimerFunction()
  opt.rafFunction && tryCatchRaf()
  opt.eventListener && tryCatchEventListener()
}

export function uninstall () {
  restore(tracker)
}

/**
 * wrap function with try catch block
 * @param  {Function} func   the original function to be wrapped
 * @return {Function}        wrapper function
 */
export function wrapWithTryCatch (func) {
  if (!isFunction(func)) {
    return
  }

  // if original function is already a wrapper function
  // don't want to wrap twice
  if (func.__fm_inner__) {
    return func
  }

  // if original function has already been wrapped before, return the wrapper
  if (func.__fm_wrapper__) {
    return func.__fm_wrapper__
  }

  function tryCatchWrapper () {
    try {
      return func.apply(this, arguments)
    } catch (e) {
      TraceKit.report(e)
      throw e // this error will be caught in window.onerror again
    }
  }

  // copy over properties of the original function
  copy(tryCatchWrapper, func)

  tryCatchWrapper.__fm_inner__ = func
  func.__fm_wrapper__ = tryCatchWrapper

  return tryCatchWrapper
}

function tryCatchTimerFunction () {
  ['setTimeout', 'setInterval'].forEach(timeFunc => {
    replace(window, timeFunc, function (original) {
      return function timerWrapper () {
        const args = toArray(arguments)
        const func = args[0]
        const time = args[1]

        if (isFunction(func)) {
          args[0] = wrapWithTryCatch(func)
        }

        // IE < 9 doesn't support .call/.apply on setInterval/setTimeout, but it
        // also supports only two arguments and doesn't care what this is, so we
        // can just call the original function directly.
        if (original.apply) {
          return original.apply(this, args)
        } else {
          return original(args[0], args[1])
        }
      }
    }, tracker)
  })
}

function tryCatchRaf () {
  if (window.requestAnimationFrame) {
    replace(window, 'requestAnimationFrame', function (original) {
      return function rafWrapper (callback) {
        return original(wrapWithTryCatch(callback))
      }
    }, tracker)
  }
}

function tryCatchEventListener () {
  [
    'EventTarget', 'Window', 'Node', 'ApplicationCache', 'AudioTrackList', 'ChannelMergerNode',
    'CryptoOperation', 'EventSource', 'FileReader', 'HTMLUnknownElement', 'IDBDatabase', 'IDBRequest',
    'IDBTransaction', 'KeyOperation', 'MediaController', 'MessagePort', 'ModalWindow', 'Notification',
    'SVGElementInstance', 'Screen', 'TextTrack', 'TextTrackCue', 'TextTrackList', 'WebSocket',
    'WebSocketWorker', 'Worker', 'XMLHttpRequest', 'XMLHttpRequestEventTarget', 'XMLHttpRequestUpload'
  ].forEach(eventTarget => {
    const prototype = window[eventTarget] && window[eventTarget].prototype

    if (prototype) {
      replace(prototype, 'addEventListener', function (original) {
        return function addEventListenerWrapper () {
          const args = toArray(arguments)
          args[1] = wrapWithTryCatch(args[1])
          return original.apply(this, args)
        }
      }, tracker)

      replace(prototype, 'removeEventListener', function (original) {
        return function removeEventListenerWrapper () {
          const args = toArray(arguments)
          args[1] = wrapWithTryCatch(args[1])
          return original.apply(this, args)
        }
      }, tracker)
    }
  })
}
