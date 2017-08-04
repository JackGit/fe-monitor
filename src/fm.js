import Utils from './utils'
import Exception from './exception'
import Inspector from './inspector'
import Performance from './performance'
import Tracer from './tracer'
import config from './config'

function init (options) {
  if (!options.projectId) {
    console.warn('FM.js projectId is required')
    return
  }

  config(options)

  Exception.install()
  Performance.install()
  Inspector.install()
}

export {
  Tracer,
  Exception,
  Inspector,
  Performance,
  Utils,
  init
}
