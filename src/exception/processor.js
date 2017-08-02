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

export function processException (error) {
  TraceKit.report(error)
}
