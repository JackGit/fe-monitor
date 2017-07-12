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

  Tracer.trace({
    type: 'navigation',
    timing: Performance.navigationTiming
  }).trace({
    type: 'resource',
    timing: Performance.resourceTiming
  }).report()
})
