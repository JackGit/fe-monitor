import Cookies from 'js-cookie'
import Tracer from '../tracer'
import { getTiming as getNavigationTiming } from './navigation'
import { getTiming as getResourceTiming } from './resource'
import { addEventListener } from '../utils/build-in'
import config from '../config'

let installed = false

export default {
  install
}

function install () {
  if (installed) {
    return
  }

  addEventListener('load', _ => {
    if (config().enableResourceTiming) {
      traceResource()
    }

    // need to put it inside a timemout, otherwise timing.loadEventEnd would return 0
    setTimeout(function () {
      tracePV() // PV will report everytime the page loads
      traceUV() // UV only report once cookies expires after a day
      Tracer.report()
    }, 0)
  })

  installed = true
}

function traceResource () {
  Tracer.trace({
    type: 'resource',
    timing: getResourceTiming()
  })
}

function tracePV () {
  Tracer.trace({
    type: 'pv',
    timing: config().enableNavigationTiming ? getNavigationTiming() : []
  })
}

function traceUV () {
  if (!Cookies.get('_fm')) {
    Tracer.trace({
      type: 'uv'
    })
    Cookies.set('_fm', Date.now(), { expires: 1 }) // expires in 1 day
  }
}
