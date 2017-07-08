import { replace, wrap, wrapFunc } from '../utils/wrap'
import { isFunction, toArray } from '../utils/lang'

export function tryCatchTimerFunctions () {
  ['setTimeout', 'setInterval'].forEach(name => {

    replace(window, name, function (orig) {
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
        if (orig.apply) {
          return orign.apply(this, args)
        } else {
          return orign(args[0], args[1])
        }
      }
    })
  })
}

export function tryCatchRAF () {
  if (window.requestAnimationFrame) {
    replace(window, 'requestAnimationFrame', function (orig) {
      return function RAFWrapper (callback) {
        return orig(wrapWithTryCatch(callback))
      }
    })
  }
}

export function tryCatchEventListener () {
  [
    'EventTarget', 'Window', 'Node', 'ApplicationCache', 'AudioTrackList', 'ChannelMergerNode',
    'CryptoOperation', 'EventSource', 'FileReader', 'HTMLUnknownElement', 'IDBDatabase', 'IDBRequest',
    'IDBTransaction', 'KeyOperation', 'MediaController', 'MessagePort', 'ModalWindow', 'Notification',
    'SVGElementInstance', 'Screen', 'TextTrack', 'TextTrackCue', 'TextTrackList', 'WebSocket',
    'WebSocketWorker', 'Worker', 'XMLHttpRequest', 'XMLHttpRequestEventTarget', 'XMLHttpRequestUpload'
  ].forEach(eventTarget => {
    const prototype = window[eventTarget] && window[eventTarget].prototype

    replace(prototype, 'addEventListener', function (original) {
      return function addEventListenerWrapper () {
        const args = toArray(arguments)
        // args[1] =
        return original.apply(this, args)
      }
    })

    replace(prototype, 'removeEventListener', function (original) {
      return function removeEventListenerWrapper () {
        const args = toArray(arguments)
        // args[1] =
        return original.apply(this, args)
      }
    })
  })
}
