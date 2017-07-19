import Cookies from 'js-cookie'
import Tracer from '../tracer'
import { getTiming as getNavigationTiming } from './navigation'
import { getTiming as getResourceTiming } from './resource'
import { addEventListener } from '../utils/build-in'

const Performance = {
  navigationTiming: [],
  resourceTiming: []
}

export default Performance

addEventListener('load', _ => {
  Performance.resourceTiming = getResourceTiming()
  Performance.navigationTiming = getNavigationTiming()

  tracePV() // PV will report everytime the page loads  
  traceUV() // UV only report once cookies expires after a day
  Tracer.report()
})

function tracePV () {
  Tracer.trace({
    type: 'pv',
    timing: {
      navigation: Performance.navigationTiming,
      resource: Performance.resourceTiming
    }
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
