import TraceKit from 'tracekit'
import { report } from '../tracer'
import * as global from './global'
import * as tryCatch from './try-catch'
import { isFunction } from '../utils/lang'

// config tracekit
TraceKit.remoteFetching = false
TraceKit.collectWindowErrors = false

// subscribe tracekit report
TraceKit.report.subscribe(function tracekitLogger (e) {
  report({
    type: 'exception',
    name: e.name,
    message: e.message,
    stack: e.stack
  })
})

export default {
  GlobalHandler: {
    install: global.install,
    uninstall: global.uninstall
  },

  TryCatchWrapper: {
    install: tryCatch.install,
    uninstall: tryCatch.uninstall
  },

  wrap: function (target) {
    if (isFunction(target)) {
      return tryCatch.wrapWithTryCatch(target)
    }
  }
}
