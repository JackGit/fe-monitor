import Tracer from './tracer'
import config from '../config'

let tracer

function getInstance () {
  if (!tracer) {
    tracer = new Tracer({
      reportUrl: config().reportUrl,
      projectId: config().projectId
    })
  }
  return tracer
}

function trace () {
  return getInstance().trace.apply(tracer, arguments)
}

function report () {
  return getInstance().report.apply(tracer, arguments)
}

export default {
  trace,
  report
}
