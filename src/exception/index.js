import GlobalHandler from './global'
import TryCatchWrapper from './try-catch'
import { isFunction } from '../utils/lang'
import config from '../config'

let installed = false

export default {
  GlobalHandler,
  TryCatchWrapper,
  wrap,
  install
}

function wrap (target) {
  if (isFunction(target)) {
    return tryCatch.wrapWithTryCatch(target)
  }
}

function install () {
  if (installed) {
    return
  }

  if (config().enableGlobalExceptionHandler) {
    GlobalHandler.install()
  }
  if (config().enableTryCatchWrapper) {
    TryCatchWrapper.install()
  }

  installed = true
}
