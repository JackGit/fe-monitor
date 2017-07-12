import GlobalHandler from './global'
import TryCatchWrapper from './try-catch'
import { isFunction } from '../utils/lang'

export default {
  GlobalHandler,
  TryCatchWrapper,
  wrap
}

function wrap (target) {
  if (isFunction(target)) {
    return tryCatch.wrapWithTryCatch(target)
  }
}
