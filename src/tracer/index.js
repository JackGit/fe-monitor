import Tracer from './tracer'

const tracer = new Tracer()

export function trace () {
  return tracer.trace.apply(tracer, arguments)
}

export function report () {
  return tracer.report.apply(tracer, arguments)
}
