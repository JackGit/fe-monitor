const add = window.addEventListener || window.attachEvent
const remove = window.removeEventListener || window.detachEvent

export function addEventListener (dom, ...args) {
  add.apply(dom, args)
}

export function removeEventListener (dom, ...args) {
  remove.apply(dom, args)
}
