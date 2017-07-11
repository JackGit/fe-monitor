import { hasKey } from './lang'

/**
 * replace a property of an object
 * the property can be replaced any times if you want
 * @param  {Object} obj         [description]
 * @param  {String} prop        [description]
 * @param  {Function} replacement [description]
 * @param  {Array} tracker       [description]
 */
export function replace (obj, prop, replacement, tracker) {
  const orignal = obj[prop]
  obj[prop] = replacement(orignal)
  if (tracker) {
    tracker.push([obj, prop, orignal])
  }
}

/**
 * revert operation of replace
 * @param  {Array} tracker [description]
 */
export function restore (tracker) {
  let trackItem
  while (tracker.length) {
    trackItem = tracker.shift()
    let obj = trackItem[0]
    let prop = trackItem[1]
    let orignal = trackItem[2]
    obj[prop] = orignal
  }
}

/**
 * copy all properties and prototype from a source function to a destination function
 * @param  {Function} dest [description]
 * @param  {Function} src  [description]
 */
export function copy (dest, src) {
  for (let prop in src) {
    if (hasKey(src, prop)) {
      dest[prop] = src[prop]
    }
  }
  dest.prototype = dest.prototype
}

/**
 * inject a before function
 * @param  {Object} obj     [description]
 * @param  {String} prop    [description]
 * @param  {Function} before  [description]
 * @param  {Array} tracker [description]
 */
export function inject (obj, prop, before, tracker) {
  replace(obj, prop, function (original) {
    return function injector () {
      before && before.apply(this, arguments)
      if (original) {
        return original.apply(this, arguments)
      }
    }
  }, tracker)
}
