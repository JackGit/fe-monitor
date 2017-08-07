import TraceKit from '../vendor/tracekit'
import Tracer from '../tracer'

// config tracekit
TraceKit.remoteFetching = false
TraceKit.collectWindowErrors = false

// subscribe tracekit report
TraceKit.report.subscribe(function tracekitLogger (e) {
  Tracer.report({
    type: 'exception',
    name: e.name || 'Error',
    message: e.message,
    stack: e.stack
  })
})

// the centralized exception process function for both window.onerror and tryCatchWrapper
export function processException (error, rethrow) {
  try {
    TraceKit.report(error) // TraceKit.report() would throw error at last
  } catch (e) {
    if (rethrow) {
      throw e
    }
  }
}
