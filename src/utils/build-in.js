export default {
  setTimeout: window.setTimeout,
  setInterval: window.setInterval,
  requestAnimationFrame: window.requestAnimationFrame,
  fetch: window.fetch,
  xhrPrototypeOpen: XMLHttpRequest.prototype.open,
  xhrPrototypeSend: XMLHttpRequest.prototype.send
}
