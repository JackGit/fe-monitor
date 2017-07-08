/**
 * for example, wrap xhr.send()
 *
 * replace(xhr, 'send', function (orig) {
 *   return wrap(orig, function () {
 *     console.log('before send')
 *   }, function () {
 *     console.log('after send')
 *   })
 * })
 */

import { hasKey } from './lang'

/**
 * replace a property of an object
 * @param  { Object } obj         [description]
 * @param  { String } prop        [description]
 * @param  { Function } replacement [description]
 * @param  { Array } track       [description]
 */
export function replace (obj, prop, replacement, track) {
  const orig = obj[prop]
  obj[prop] = replacement(orig)
  if (track) {
    track.push([obj, prop, orig])
  }
}

/**
 * revert operation of replace
 * @param  { Array } track [description]
 */
export function restore (track) {
  let builtin

  while (track.length) {
    builtin = track.shift()
    let obj = builtin[0]
    let name = builtin[1]
    let orig = builtin[2]
    obj[name] = orig

    // remove the wrapper attribute
    if (orig.__fm_wrapper__) {
      delete orig.__fm_wrapper__
    }
  }
}

/**
 * wrap a function
 * @param  { Function } func   [description]
 * @param  { Function } before [description]
 * @param  { Function } after  [description]
 */
export function wrap (func, before, after) {
  // if original function is already a wrapper function
  // don't want to wrap twice
  if (func.__fm_inner__) {
    return func
  }

  // if original function has already been wrapped before, return the wrapper
  if (func.__fm_wrapper__) {
    return func.__fm_wrapper__
  }

  function wrapper () {
    before && before.apply(this, arguments)

    if (after) {
      func.apply(this, arguments)
      return after.apply(this, arguments)
    } else {
      return func.apply(this, arguments)
    }
  }

  // copy over properties of the original function
  for (let prop in func) {
    if (hasKey(func, prop)) {
      wrapper[prop] = func[prop]
    }
  }

  // wrapper.prototype = func.prototype
  wrapper.__fm_inner__ = func
  func.__fm_wrapper__ = wrapper

  return wrapper
}

export function wrapFunc (obj, prop, before, after, track) {
  replace(obj, prop, function (orig) {
    return wrap(orig, before, after)
  }, track)
}
